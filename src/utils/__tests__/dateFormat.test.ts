import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { formatDate, formatRelative } from '../dateFormat'

describe('formatDate', () => {
  it('formats a valid ISO string into a readable date', () => {
    const result = formatDate('2024-06-15T14:30:00.000Z')
    expect(result).toContain('2024')
    expect(result).toMatch(/Jun|June/)
  })

  it('formats another valid ISO date string', () => {
    const result = formatDate('2023-01-01T00:00:00.000Z')
    expect(result).toContain('2023')
    expect(result).toMatch(/Jan|January/)
  })
})

describe('formatRelative', () => {
  const NOW = new Date('2024-06-15T12:00:00.000Z').getTime()

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "just now" when diff is less than 1 minute', () => {
    const iso = new Date(NOW - 30_000).toISOString()
    expect(formatRelative(iso)).toBe('just now')
  })

  it('returns minutes ago when diff is less than 60 minutes', () => {
    const iso = new Date(NOW - 5 * 60_000).toISOString()
    expect(formatRelative(iso)).toBe('5m ago')
  })

  it('returns hours ago when diff is less than 24 hours', () => {
    const iso = new Date(NOW - 3 * 3600_000).toISOString()
    expect(formatRelative(iso)).toBe('3h ago')
  })

  it('returns days ago when diff is less than 30 days', () => {
    const iso = new Date(NOW - 7 * 86400_000).toISOString()
    expect(formatRelative(iso)).toBe('7d ago')
  })

  it('returns months ago when diff is 30 or more days', () => {
    const iso = new Date(NOW - 60 * 86400_000).toISOString()
    expect(formatRelative(iso)).toBe('2mo ago')
  })
})
