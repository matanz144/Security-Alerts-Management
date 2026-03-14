import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { createElement, type ReactNode } from 'react'
import { useFilters } from '../useFilters'

function createWrapper(initialEntries: string[] = ['/']) {
  return ({ children }: { children: ReactNode }) =>
    createElement(MemoryRouter, { initialEntries }, children)
}

describe('useFilters — defaults', () => {
  it('returns default values when URL has no params', () => {
    const { result } = renderHook(() => useFilters(), { wrapper: createWrapper() })
    expect(result.current.search).toBe('')
    expect(result.current.page).toBe(1)
    expect(result.current.sortField).toBe('createdAt')
    expect(result.current.sortOrder).toBe('desc')
    expect(result.current.severities).toEqual([])
    expect(result.current.statuses).toEqual([])
  })

  it('reads initial values from URL params', () => {
    const { result } = renderHook(() => useFilters(), {
      wrapper: createWrapper([
        '/?search=brute&page=2&sortField=severity&sortOrder=asc&severity=high&status=open',
      ]),
    })
    expect(result.current.search).toBe('brute')
    expect(result.current.page).toBe(2)
    expect(result.current.sortField).toBe('severity')
    expect(result.current.sortOrder).toBe('asc')
    expect(result.current.severities).toEqual(['high'])
    expect(result.current.statuses).toEqual(['open'])
  })
})

describe('useFilters — setSearch', () => {
  it('updates search param', () => {
    const { result } = renderHook(() => useFilters(), { wrapper: createWrapper() })
    act(() => result.current.setSearch('malware'))
    expect(result.current.search).toBe('malware')
  })

  it('resets page to 1 when search changes', () => {
    const { result } = renderHook(() => useFilters(), {
      wrapper: createWrapper(['/?page=3']),
    })
    act(() => result.current.setSearch('test'))
    expect(result.current.page).toBe(1)
  })

  it('removes search param when set to empty string', () => {
    const { result } = renderHook(() => useFilters(), {
      wrapper: createWrapper(['/?search=something']),
    })
    act(() => result.current.setSearch(''))
    expect(result.current.search).toBe('')
  })
})

describe('useFilters — setSeverities', () => {
  it('updates severities param', () => {
    const { result } = renderHook(() => useFilters(), { wrapper: createWrapper() })
    act(() => result.current.setSeverities(['critical', 'high']))
    expect(result.current.severities).toEqual(['critical', 'high'])
  })

  it('resets page to 1', () => {
    const { result } = renderHook(() => useFilters(), { wrapper: createWrapper(['/?page=5']) })
    act(() => result.current.setSeverities(['low']))
    expect(result.current.page).toBe(1)
  })

  it('clears severities when set to empty array', () => {
    const { result } = renderHook(() => useFilters(), {
      wrapper: createWrapper(['/?severity=critical']),
    })
    act(() => result.current.setSeverities([]))
    expect(result.current.severities).toEqual([])
  })
})

describe('useFilters — setStatuses', () => {
  it('updates statuses param', () => {
    const { result } = renderHook(() => useFilters(), { wrapper: createWrapper() })
    act(() => result.current.setStatuses(['open', 'resolved']))
    expect(result.current.statuses).toEqual(['open', 'resolved'])
  })

  it('resets page to 1', () => {
    const { result } = renderHook(() => useFilters(), { wrapper: createWrapper(['/?page=3']) })
    act(() => result.current.setStatuses(['investigating']))
    expect(result.current.page).toBe(1)
  })
})

describe('useFilters — setSort', () => {
  it('updates sortField and sortOrder', () => {
    const { result } = renderHook(() => useFilters(), { wrapper: createWrapper() })
    act(() => result.current.setSort('severity', 'asc'))
    expect(result.current.sortField).toBe('severity')
    expect(result.current.sortOrder).toBe('asc')
  })

  it('resets page to 1', () => {
    const { result } = renderHook(() => useFilters(), { wrapper: createWrapper(['/?page=4']) })
    act(() => result.current.setSort('createdAt', 'asc'))
    expect(result.current.page).toBe(1)
  })
})

describe('useFilters — setPage', () => {
  it('updates page param', () => {
    const { result } = renderHook(() => useFilters(), { wrapper: createWrapper() })
    act(() => result.current.setPage(3))
    expect(result.current.page).toBe(3)
  })

  it('does NOT reset other filters when changing page', () => {
    const { result } = renderHook(() => useFilters(), {
      wrapper: createWrapper(['/?search=test&severity=high']),
    })
    act(() => result.current.setPage(2))
    expect(result.current.search).toBe('test')
    expect(result.current.severities).toEqual(['high'])
    expect(result.current.page).toBe(2)
  })
})

describe('useFilters — resetFilters', () => {
  it('clears all params back to defaults', () => {
    const { result } = renderHook(() => useFilters(), {
      wrapper: createWrapper([
        '/?search=test&page=5&severity=critical&status=open&sortField=severity&sortOrder=asc',
      ]),
    })
    act(() => result.current.resetFilters())
    expect(result.current.search).toBe('')
    expect(result.current.page).toBe(1)
    expect(result.current.severities).toEqual([])
    expect(result.current.statuses).toEqual([])
    expect(result.current.sortField).toBe('createdAt')
    expect(result.current.sortOrder).toBe('desc')
  })
})
