import { useQuery, skipToken } from '@tanstack/react-query'
import { getAlertById } from '@/services/alertsService'

/**
 * Fetches a single alert by its ID.
 * Returns `null` in `data` if no alert exists with the given ID.
 * The query is skipped entirely if `id` is an empty string.
 */
export function useAlertById(id: string | undefined) {
  return useQuery({
    queryKey: ['alert', id],
    queryFn: id ? () => getAlertById(id) : skipToken,
  })
}
