import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebouncedSearch } from '../useDebouncedSearch'

describe('useDebouncedSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initialises inputValue from the provided urlValue', () => {
    const { result } = renderHook(() => useDebouncedSearch('initial', vi.fn()))
    expect(result.current.inputValue).toBe('initial')
  })

  it('updates inputValue immediately on onChange', () => {
    const { result } = renderHook(() => useDebouncedSearch('', vi.fn()))
    act(() => {
      result.current.onChange('hello')
    })
    expect(result.current.inputValue).toBe('hello')
  })

  it('does not call setUrlValue before the debounce delay', () => {
    const setUrlValue = vi.fn()
    const { result } = renderHook(() => useDebouncedSearch('', setUrlValue))
    act(() => {
      result.current.onChange('hello')
    })
    expect(setUrlValue).not.toHaveBeenCalled()
  })

  it('calls setUrlValue after the 300ms debounce delay', () => {
    const setUrlValue = vi.fn()
    const { result } = renderHook(() => useDebouncedSearch('', setUrlValue))
    act(() => {
      result.current.onChange('hello')
      vi.advanceTimersByTime(300)
    })
    expect(setUrlValue).toHaveBeenCalledWith('hello')
    expect(setUrlValue).toHaveBeenCalledTimes(1)
  })

  it('only fires once for rapid successive changes (debounce collapses calls)', () => {
    const setUrlValue = vi.fn()
    const { result } = renderHook(() => useDebouncedSearch('', setUrlValue))
    act(() => {
      result.current.onChange('a')
      result.current.onChange('ab')
      result.current.onChange('abc')
      vi.advanceTimersByTime(300)
    })
    expect(setUrlValue).toHaveBeenCalledTimes(1)
    expect(setUrlValue).toHaveBeenCalledWith('abc')
  })

  it('syncs inputValue when urlValue changes externally', () => {
    const setUrlValue = vi.fn()
    const { result, rerender } = renderHook(
      ({ url }: { url: string }) => useDebouncedSearch(url, setUrlValue),
      { initialProps: { url: 'initial' } },
    )
    expect(result.current.inputValue).toBe('initial')
    rerender({ url: '' })
    expect(result.current.inputValue).toBe('')
  })
})
