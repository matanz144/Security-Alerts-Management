import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { createElement, type ReactNode } from 'react'
import { useAlertById } from '../useAlertById'
import { ALERT_FIXTURES } from '@/__tests__/fixtures/alerts'

vi.mock('@/services/alertsService', () => ({
  getAlertById: vi.fn(),
}))

import { getAlertById } from '@/services/alertsService'

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
  vi.mocked(getAlertById).mockResolvedValue(ALERT_FIXTURES[0])
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('useAlertById', () => {
  it('returns data for a valid id', async () => {
    const { result } = renderHook(() => useAlertById('alert-1'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(ALERT_FIXTURES[0])
  })

  it('does not execute the query when id is undefined', () => {
    const { result } = renderHook(() => useAlertById(undefined), { wrapper: createWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
    expect(getAlertById).not.toHaveBeenCalled()
  })

  it('does not execute the query when id is an empty string', () => {
    const { result } = renderHook(() => useAlertById(''), { wrapper: createWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
    expect(getAlertById).not.toHaveBeenCalled()
  })
})
