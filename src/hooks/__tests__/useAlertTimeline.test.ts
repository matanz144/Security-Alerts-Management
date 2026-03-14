import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { createElement, type ReactNode } from 'react'
import { useAlertTimeline } from '../useAlertTimeline'
import { TIMELINE_FIXTURES } from '@/__tests__/fixtures/timeline'

vi.mock('@/services/alertsService', () => ({
  getAlertTimeline: vi.fn(),
}))

import { getAlertTimeline } from '@/services/alertsService'

const ALERT_1_EVENTS = TIMELINE_FIXTURES.filter((e) => e.alertId === 'alert-1')

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
  vi.mocked(getAlertTimeline).mockResolvedValue(ALERT_1_EVENTS)
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('useAlertTimeline', () => {
  it('returns timeline events for a valid alertId', async () => {
    const { result } = renderHook(() => useAlertTimeline('alert-1'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(ALERT_1_EVENTS)
  })

  it('does not execute the query when alertId is an empty string', () => {
    const { result } = renderHook(() => useAlertTimeline(''), { wrapper: createWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
    expect(getAlertTimeline).not.toHaveBeenCalled()
  })
})
