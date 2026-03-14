import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useExportCsv } from '../useExportCsv'
import { ALERT_FIXTURES } from '@/__tests__/fixtures/alerts'
import type { IAlertsResponse, IAlertsQuery } from '@/types/alert'

vi.mock('@/services/alertsService', () => ({
  getAlerts: vi.fn(),
}))

import { getAlerts } from '@/services/alertsService'

const BASE_QUERY: IAlertsQuery = {
  page: 1,
  pageSize: 10,
  severities: [],
  statuses: [],
  search: '',
  sortField: 'createdAt',
  sortOrder: 'desc',
}

const MOCK_RESPONSE: IAlertsResponse = {
  data: ALERT_FIXTURES,
  total: ALERT_FIXTURES.length,
  page: 1,
  pageSize: ALERT_FIXTURES.length,
}

beforeEach(() => {
  vi.mocked(getAlerts).mockResolvedValue(MOCK_RESPONSE)
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
  vi.spyOn(URL, 'revokeObjectURL').mockReturnValue(undefined)
  const mockAnchor = { href: '', download: '', click: vi.fn() } as unknown as HTMLAnchorElement
  vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useExportCsv', () => {
  describe('initial state', () => {
    it('starts with isExporting false and no error', () => {
      const { result } = renderHook(() => useExportCsv(BASE_QUERY, 4))
      expect(result.current.isExporting).toBe(false)
      expect(result.current.exportError).toBeNull()
    })
  })

  describe('handleExportCsv', () => {
    it('does not fetch when total is 0', async () => {
      const { result } = renderHook(() => useExportCsv(BASE_QUERY, 0))
      await act(() => result.current.handleExportCsv())
      expect(getAlerts).not.toHaveBeenCalled()
    })

    it('fetches all records in a single call using the provided total', async () => {
      const { result } = renderHook(() => useExportCsv(BASE_QUERY, 4))
      await act(() => result.current.handleExportCsv())
      expect(getAlerts).toHaveBeenCalledWith(expect.objectContaining({ page: 1, pageSize: 4 }))
    })

    it('passes active filters to the fetch call', async () => {
      const query = { ...BASE_QUERY, severities: ['critical'] as IAlertsQuery['severities'] }
      const { result } = renderHook(() => useExportCsv(query, 2))
      await act(() => result.current.handleExportCsv())
      expect(getAlerts).toHaveBeenCalledWith(expect.objectContaining({ severities: ['critical'] }))
    })

    it('triggers a CSV download after fetching', async () => {
      const clickSpy = vi.fn()
      vi.spyOn(document, 'createElement').mockReturnValue(
        { href: '', download: '', click: clickSpy } as unknown as HTMLAnchorElement,
      )
      const { result } = renderHook(() => useExportCsv(BASE_QUERY, 4))
      await act(() => result.current.handleExportCsv())
      expect(clickSpy).toHaveBeenCalledOnce()
    })

    it('sets isExporting to true while fetching and false after', async () => {
      let resolveGetAlerts!: (v: IAlertsResponse) => void
      vi.mocked(getAlerts).mockReturnValueOnce(new Promise((res) => { resolveGetAlerts = res }))

      const { result } = renderHook(() => useExportCsv(BASE_QUERY, 4))

      act(() => { result.current.handleExportCsv() })
      await waitFor(() => expect(result.current.isExporting).toBe(true))

      await act(() => { resolveGetAlerts(MOCK_RESPONSE) })
      expect(result.current.isExporting).toBe(false)
    })

    it('sets exportError and clears isExporting when the fetch fails', async () => {
      vi.mocked(getAlerts).mockRejectedValueOnce(new Error('Network error'))
      const { result } = renderHook(() => useExportCsv(BASE_QUERY, 4))
      await act(() => result.current.handleExportCsv())
      expect(result.current.exportError).toBe('Export failed. Please try again.')
      expect(result.current.isExporting).toBe(false)
    })

    it('clears a previous exportError at the start of a new export', async () => {
      vi.mocked(getAlerts).mockRejectedValueOnce(new Error('fail'))
      const { result } = renderHook(() => useExportCsv(BASE_QUERY, 4))
      await act(() => result.current.handleExportCsv())
      expect(result.current.exportError).not.toBeNull()

      vi.mocked(getAlerts).mockResolvedValueOnce(MOCK_RESPONSE)
      await act(() => result.current.handleExportCsv())
      expect(result.current.exportError).toBeNull()
    })

    it('creates a CSV blob with the correct MIME type', async () => {
      const createObjectURLSpy = vi.mocked(URL.createObjectURL)
      const { result } = renderHook(() => useExportCsv(BASE_QUERY, 4))
      await act(() => result.current.handleExportCsv())
      const blob = createObjectURLSpy.mock.calls[0][0] as Blob
      expect(blob.type).toBe('text/csv;charset=utf-8;')
    })

    it('includes all required CSV headers', async () => {
      let capturedBlob!: Blob
      vi.mocked(URL.createObjectURL).mockImplementation((blob) => { capturedBlob = blob as Blob; return 'blob:mock-url' })
      const { result } = renderHook(() => useExportCsv(BASE_QUERY, 4))
      await act(() => result.current.handleExportCsv())
      const headerRow = (await capturedBlob.text()).split('\n')[0]
      expect(headerRow).toBe('ID,Title,Severity,Status,Source,Created At,Description')
    })

    it('maps each alert to a CSV data row', async () => {
      vi.mocked(getAlerts).mockResolvedValueOnce({ ...MOCK_RESPONSE, data: [ALERT_FIXTURES[0]] })
      let capturedBlob!: Blob
      vi.mocked(URL.createObjectURL).mockImplementation((blob) => { capturedBlob = blob as Blob; return 'blob:mock-url' })
      const { result } = renderHook(() => useExportCsv(BASE_QUERY, 1))
      await act(() => result.current.handleExportCsv())
      const rows = (await capturedBlob.text()).split('\n')
      expect(rows).toHaveLength(2)
      expect(rows[1]).toContain('alert-1')
      expect(rows[1]).toContain('critical')
    })

    it('escapes cells containing commas', async () => {
      const alertWithComma = { ...ALERT_FIXTURES[0], title: 'Alert, with comma' }
      vi.mocked(getAlerts).mockResolvedValueOnce({ ...MOCK_RESPONSE, data: [alertWithComma] })
      let capturedBlob!: Blob
      vi.mocked(URL.createObjectURL).mockImplementation((blob) => { capturedBlob = blob as Blob; return 'blob:mock-url' })
      const { result } = renderHook(() => useExportCsv(BASE_QUERY, 1))
      await act(() => result.current.handleExportCsv())
      expect(await capturedBlob.text()).toContain('"Alert, with comma"')
    })

    it('escapes cells containing double quotes', async () => {
      const alertWithQuote = { ...ALERT_FIXTURES[0], title: 'Alert "with" quotes' }
      vi.mocked(getAlerts).mockResolvedValueOnce({ ...MOCK_RESPONSE, data: [alertWithQuote] })
      let capturedBlob!: Blob
      vi.mocked(URL.createObjectURL).mockImplementation((blob) => { capturedBlob = blob as Blob; return 'blob:mock-url' })
      const { result } = renderHook(() => useExportCsv(BASE_QUERY, 1))
      await act(() => result.current.handleExportCsv())
      expect(await capturedBlob.text()).toContain('"Alert ""with"" quotes"')
    })
  })
})
