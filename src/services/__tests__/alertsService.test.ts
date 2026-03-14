/**
 * Tests for alertsService using real JSON data and fake timers to skip delays.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getAlerts, getAlertById, getAlertTimeline } from '../alertsService'
import type { IAlert, ITimelineEvent } from '@/types/alert'
import alertsJson from '@/data/alerts.json'
import timelineJson from '@/data/timeline.json'

const allAlerts = alertsJson as IAlert[]
const allTimeline = timelineJson as ITimelineEvent[]

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

async function run<T>(promise: Promise<T>): Promise<T> {
  vi.runAllTimers()
  return promise
}

const BASE_QUERY = {
  page: 1,
  pageSize: 20,
  severities: [] as IAlert['severity'][],
  statuses: [] as IAlert['status'][],
  search: '',
  sortField: 'createdAt' as const,
  sortOrder: 'desc' as const,
}

describe('getAlerts', () => {
  it('returns up to pageSize items per page', async () => {
    const result = await run(getAlerts(BASE_QUERY))
    expect(result.data.length).toBeLessThanOrEqual(20)
    expect(result.total).toBe(allAlerts.length)
  })

  it('returns correct page/pageSize metadata', async () => {
    const result = await run(getAlerts(BASE_QUERY))
    expect(result.page).toBe(1)
    expect(result.pageSize).toBe(20)
  })

  it('paginates: page 1 and page 2 contain different items', async () => {
    const p1 = await run(getAlerts({ ...BASE_QUERY, pageSize: 5, page: 1 }))
    const p2 = await run(getAlerts({ ...BASE_QUERY, pageSize: 5, page: 2 }))
    const ids1 = new Set(p1.data.map((a) => a.id))
    expect(p2.data.some((a) => ids1.has(a.id))).toBe(false)
  })

  it('filters by a single severity', async () => {
    const result = await run(getAlerts({ ...BASE_QUERY, severities: ['critical'], pageSize: 100 }))
    expect(result.data.length).toBeGreaterThan(0)
    expect(result.data.every((a) => a.severity === 'critical')).toBe(true)
  })

  it('filters by multiple severities', async () => {
    const result = await run(
      getAlerts({ ...BASE_QUERY, severities: ['high', 'medium'], pageSize: 100 }),
    )
    expect(result.data.every((a) => a.severity === 'high' || a.severity === 'medium')).toBe(true)
  })

  it('filters by status', async () => {
    const result = await run(getAlerts({ ...BASE_QUERY, statuses: ['open'], pageSize: 100 }))
    expect(result.data.length).toBeGreaterThan(0)
    expect(result.data.every((a) => a.status === 'open')).toBe(true)
  })

  it('combines severity and status filters', async () => {
    const result = await run(
      getAlerts({ ...BASE_QUERY, severities: ['critical'], statuses: ['open'], pageSize: 100 }),
    )
    expect(result.data.every((a) => a.severity === 'critical' && a.status === 'open')).toBe(true)
  })

  it('searches by title (case-insensitive)', async () => {
    const sampleWord = allAlerts[0].title.split(' ')[0].toLowerCase()
    const result = await run(getAlerts({ ...BASE_QUERY, search: sampleWord, pageSize: 100 }))
    expect(result.total).toBeGreaterThan(0)
    expect(
      result.data.every(
        (a) =>
          a.title.toLowerCase().includes(sampleWord) ||
          a.description.toLowerCase().includes(sampleWord),
      ),
    ).toBe(true)
  })

  it('returns empty results for a search that matches nothing', async () => {
    const result = await run(
      getAlerts({ ...BASE_QUERY, search: 'zyxwvutsrqponmlkjihgfedcba-no-match' }),
    )
    expect(result.total).toBe(0)
    expect(result.data).toHaveLength(0)
  })

  it('sorts by createdAt descending', async () => {
    const result = await run(
      getAlerts({ ...BASE_QUERY, sortField: 'createdAt', sortOrder: 'desc', pageSize: 100 }),
    )
    const dates = result.data.map((a) => new Date(a.createdAt).getTime())
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i])
    }
  })

  it('sorts by createdAt ascending', async () => {
    const result = await run(
      getAlerts({ ...BASE_QUERY, sortField: 'createdAt', sortOrder: 'asc', pageSize: 100 }),
    )
    const dates = result.data.map((a) => new Date(a.createdAt).getTime())
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1]).toBeLessThanOrEqual(dates[i])
    }
  })

  it('sorts by severity descending (critical first)', async () => {
    const weight: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 }
    const result = await run(
      getAlerts({ ...BASE_QUERY, sortField: 'severity', sortOrder: 'desc', pageSize: 100 }),
    )
    const weights = result.data.map((a) => weight[a.severity])
    for (let i = 1; i < weights.length; i++) {
      expect(weights[i - 1]).toBeGreaterThanOrEqual(weights[i])
    }
  })

  it('sorts by severity ascending (low first)', async () => {
    const weight: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 }
    const result = await run(
      getAlerts({ ...BASE_QUERY, sortField: 'severity', sortOrder: 'asc', pageSize: 100 }),
    )
    const weights = result.data.map((a) => weight[a.severity])
    for (let i = 1; i < weights.length; i++) {
      expect(weights[i - 1]).toBeLessThanOrEqual(weights[i])
    }
  })
})

describe('getAlertById', () => {
  it('returns the alert for a valid id', async () => {
    const id = allAlerts[0].id
    const result = await run(getAlertById(id))
    expect(result).not.toBeNull()
    expect((result as IAlert).id).toBe(id)
  })

  it('returns null for an unknown id', async () => {
    const result = await run(getAlertById('unknown-id-xyz'))
    expect(result).toBeNull()
  })
})

describe('getAlertTimeline', () => {
  it('returns timeline events for a known alertId', async () => {
    const alertId = allTimeline[0].alertId
    const result = await run(getAlertTimeline(alertId))
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((e: ITimelineEvent) => e.alertId === alertId)).toBe(true)
  })

  it('returns empty array for an unknown alertId', async () => {
    const result = await run(getAlertTimeline('unknown-alert-xyz'))
    expect(result).toEqual([])
  })

  it('returns events sorted by timestamp ascending', async () => {
    const alertId = allTimeline[0].alertId
    const result = await run(getAlertTimeline(alertId))
    const timestamps = result.map((e: ITimelineEvent) => new Date(e.timestamp).getTime())
    for (let i = 1; i < timestamps.length; i++) {
      expect(timestamps[i - 1]).toBeLessThanOrEqual(timestamps[i])
    }
  })
})
