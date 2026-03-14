import type { ReactNode } from 'react'
import type { IAlert } from '@/types/alert'
import { Badge } from '@/components/ui/Badge'
import { TableCell } from '@/components/ui/TableCell'
import { ChevronRightIcon } from '@/components/ui/ChevronRightIcon'
import { formatDate } from '@/utils/dateFormat'

export interface IColumnDef {
  key: string
  header: string
  sortKey?: 'severity' | 'createdAt'
  headerTestId?: string
  headerClassName?: string
  renderCell: (alert: IAlert) => ReactNode
}

export const COLUMNS: IColumnDef[] = [
  {
    key: 'id',
    header: 'ID',
    headerTestId: 'alert-col-header-id',
    renderCell: (alert) => (
      <TableCell data-testid={`alert-cell-id-${alert.id}`} className="max-w-24">
        <span className="block truncate font-mono text-xs text-gray-400" title={alert.id}>
          {alert.id}
        </span>
      </TableCell>
    ),
  },
  {
    key: 'title',
    header: 'Title',
    headerTestId: 'alert-col-header-title',
    renderCell: (alert) => (
      <TableCell data-testid={`alert-cell-title-${alert.id}`} nowrap={false}>
        <span className="font-medium text-gray-900 group-hover:text-indigo-700 transition-colors">
          {alert.title}
        </span>
      </TableCell>
    ),
  },
  {
    key: 'description',
    header: 'Description',
    headerTestId: 'alert-col-header-description',
    renderCell: (alert) => (
      <TableCell data-testid={`alert-cell-description-${alert.id}`} nowrap={false} className="max-w-xs">
        <span className="block truncate text-sm text-gray-500" title={alert.description}>
          {alert.description}
        </span>
      </TableCell>
    ),
  },
  {
    key: 'severity',
    header: 'Severity',
    sortKey: 'severity',
    headerTestId: 'alert-col-header-severity',
    renderCell: (alert) => (
      <TableCell data-testid={`alert-cell-severity-${alert.id}`}>
        <Badge value={alert.severity} />
      </TableCell>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    headerTestId: 'alert-col-header-status',
    renderCell: (alert) => (
      <TableCell data-testid={`alert-cell-status-${alert.id}`}>
        <Badge value={alert.status} />
      </TableCell>
    ),
  },
  {
    key: 'source',
    header: 'Source',
    headerTestId: 'alert-col-header-source',
    renderCell: (alert) => (
      <TableCell data-testid={`alert-cell-source-${alert.id}`} className="text-sm text-gray-500">
        {alert.source}
      </TableCell>
    ),
  },
  {
    key: 'createdAt',
    header: 'Created At',
    sortKey: 'createdAt',
    headerTestId: 'alert-col-header-created-at',
    renderCell: (alert) => (
      <TableCell data-testid={`alert-cell-created-at-${alert.id}`} className="text-sm text-gray-500">
        {formatDate(alert.createdAt)}
      </TableCell>
    ),
  },
  {
    key: 'actions',
    header: '',
    headerClassName: 'px-4 py-3',
    renderCell: (alert) => (
      <TableCell data-testid={`alert-cell-actions-${alert.id}`} className="text-right">
        <ChevronRightIcon />
      </TableCell>
    ),
  },
]
