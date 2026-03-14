import { useQuery } from '@tanstack/react-query'
import { getAlertTimeline } from '@/services/alertsService'

/**
 * Fetches the activity timeline for a given alert, sorted ascending by timestamp.
 * The query is skipped entirely if `alertId` is an empty string.
 */
export function useAlertTimeline(alertId: string) {
  return useQuery({
    queryKey: ['alert-timeline', alertId],
    queryFn: () => getAlertTimeline(alertId),
    enabled: Boolean(alertId),
  })
}
