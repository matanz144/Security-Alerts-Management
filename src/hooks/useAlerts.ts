import { useQuery } from '@tanstack/react-query'
import { getAlerts } from '@/services/alertsService'
import type { IAlertsQuery } from '@/types/alert'

export const PAGE_SIZE = 20

export const useAlerts = (query: IAlertsQuery) => {

  const result = useQuery({
    queryKey: ['alerts', query],
    queryFn: () => getAlerts({...query, pageSize: query.pageSize ?? PAGE_SIZE }),
    placeholderData: (prev) => prev,
  })

  return result
}
