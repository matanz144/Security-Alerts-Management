import { useQuery } from '@tanstack/react-query'
import { getAlertById } from '@/services/alertsService'

export function useAlertById(id: string) {
  return useQuery({
    queryKey: ['alert', id],
    queryFn: () => getAlertById(id),
    enabled: Boolean(id),
  })
}
