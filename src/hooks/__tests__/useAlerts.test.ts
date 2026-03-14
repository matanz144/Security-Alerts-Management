import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { createElement, type ReactNode } from 'react'
import { useAlerts, PAGE_SIZE } from '../useAlerts'
import { ALERT_FIXTURES } from '@/__tests__/fixtures/alerts'
import type { IAlertsResponse, IAlertsQuery } from '@/types/alert'

vi.mock('@/services/alertsService', () => ({
  getAlerts: vi.fn(),
}))

import { getAlerts } from '@/services/alertsService'

const BASE_QUERY: IAlertsQuery = {
  page: 1,
  pageSize: PAGE_SIZE,
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
  pageSize: PAGE_SIZE,
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient },
      createElement(MemoryRouter, null, children)
    )
}

beforeEach(() => {
  vi.mocked(getAlerts).mockResolvedValue(MOCK_RESPONSE)
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('useAlerts', () => {
  it('starts in a loading state', () => {
    const { result } = renderHook(() => useAlerts(BASE_QUERY), { wrapper: createWrapper() })
    expect(result.current.isLoading).toBe(true)
  })

  it('returns data after the query resolves', async () => {
    const { result } = renderHook(() => useAlerts(BASE_QUERY), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(MOCK_RESPONSE)
  })

  it('calls getAlerts with the provided query', async () => {
    const { result } = renderHook(() => useAlerts(BASE_QUERY), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(getAlerts).toHaveBeenCalledWith({ ...BASE_QUERY, pageSize: PAGE_SIZE })
  })

  it('re-fetches when the query changes', async () => {
    const page2Response: IAlertsResponse = { ...MOCK_RESPONSE, page: 2 }
    vi.mocked(getAlerts)
      .mockResolvedValueOnce(MOCK_RESPONSE)
      .mockResolvedValueOnce(page2Response)

    const { result, rerender } = renderHook(
      ({ query }: { query: IAlertsQuery }) => useAlerts(query),
      { wrapper: createWrapper(), initialProps: { query: { ...BASE_QUERY, page: 1 } } },
    )
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    rerender({ query: { ...BASE_QUERY, page: 2 } })
    await waitFor(() => expect(result.current.data?.page).toBe(2))
  })
})
