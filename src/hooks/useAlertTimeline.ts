import { useQuery } from '@tanstack/react-query'
import { getAlertTimeline } from '@/services/alertsService'

export function useAlertTimeline(alertId: string) {
  return useQuery({
    queryKey: ['alert-timeline', alertId],
    queryFn: () => getAlertTimeline(alertId),
    enabled: Boolean(alertId),
  })
}
