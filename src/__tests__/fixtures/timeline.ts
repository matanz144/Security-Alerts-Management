import type { ITimelineEvent } from '@/types/alert'

export const TIMELINE_FIXTURES: ITimelineEvent[] = [
  {
    id: 'event-1',
    alertId: 'alert-1',
    event: 'Alert created and ingested.',
    timestamp: '2024-01-03T10:00:00.000Z',
  },
  {
    id: 'event-2',
    alertId: 'alert-1',
    event: 'Analyst assigned to investigate.',
    timestamp: '2024-01-03T11:00:00.000Z',
  },
  {
    id: 'event-3',
    alertId: 'alert-2',
    event: 'Alert created and ingested.',
    timestamp: '2024-01-02T08:00:00.000Z',
  },
]
