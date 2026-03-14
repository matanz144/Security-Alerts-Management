import alertsRaw from '@/data/alerts.json'
import timelineRaw from '@/data/timeline.json'
import type { IAlert, IAlertsQuery, IAlertsResponse, ITimelineEvent, TSeverity } from '@/types/alert'

const alerts = alertsRaw as IAlert[]
const timelineEvents = timelineRaw as ITimelineEvent[]

const SEVERITY_WEIGHT: Record<TSeverity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
}

function delay(min: number, max: number): Promise<void> {
  const ms = min + Math.random() * (max - min)
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getAlerts(query: IAlertsQuery): Promise<IAlertsResponse> {
  await delay(200, 600)

  let result = [...alerts]

  // Filter by severity
  if (query.severities.length > 0) {
    result = result.filter((a) => query.severities.includes(a.severity))
  }

  // Filter by status
  if (query.statuses.length > 0) {
    result = result.filter((a) => query.statuses.includes(a.status))
  }

  // Full-text search on title + description
  if (query.search.trim()) {
    const term = query.search.toLowerCase()
    result = result.filter(
      (a) => a.title.toLowerCase().includes(term) || a.description.toLowerCase().includes(term),
    )
  }

  // Sort
  result.sort((a, b) => {
    if (query.sortField === 'createdAt') {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return query.sortOrder === 'asc' ? diff : -diff
    } else {
      const diff = SEVERITY_WEIGHT[a.severity] - SEVERITY_WEIGHT[b.severity]
      return query.sortOrder === 'asc' ? diff : -diff
    }
  })

  const total = result.length
  const start = (query.page - 1) * query.pageSize
  const data = result.slice(start, start + query.pageSize)

  return { data, total, page: query.page, pageSize: query.pageSize }
}

export async function getAlertById(id: string): Promise<IAlert | null> {
  await delay(200, 400)
  return alerts.find((a) => a.id === id) ?? null
}

export async function getAlertTimeline(alertId: string): Promise<ITimelineEvent[]> {
  await delay(100, 300)
  return timelineEvents
    .filter((e) => e.alertId === alertId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}
