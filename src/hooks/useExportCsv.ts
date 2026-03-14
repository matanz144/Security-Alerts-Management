import { useCallback, useState } from 'react'
import { getAlerts } from '@/services/alertsService'
import type { IAlert, IAlertsQuery } from '@/types/alert'

const escapeCsvCell = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

const exportAlertsToCsv = (alerts: IAlert[], filename = 'security-alerts.csv'): void => {
  const headers = ['ID', 'Title', 'Severity', 'Status', 'Source', 'Created At', 'Description']
  const rows = alerts.map((a) => [
    a.id,
    a.title,
    a.severity,
    a.status,
    a.source,
    a.createdAt,
    a.description,
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsvCell).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export const useExportCsv = (query: IAlertsQuery, total: number) => {
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const handleExportCsv = useCallback(async () => {
    if (total === 0) return
    setIsExporting(true)
    setExportError(null)
    try {
      const { data } = await getAlerts({ ...query, page: 1, pageSize: total })
      exportAlertsToCsv(data)
    } catch {
      setExportError('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }, [query, total])

  return { handleExportCsv, isExporting, exportError }
}
