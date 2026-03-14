import { memo } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import type { IAlert, TSortField, TSortOrder } from '@/types/alert'
import { cn } from '@/lib/utils'
import { textVariants } from '@/components/ui/Text'
import { AlertRow } from '@/components/alerts/AlertRow'
import { COLUMNS } from '@/components/alerts/alertColumns'

interface IAlertTableProps {
  alerts: IAlert[]
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  sortField: TSortField
  sortOrder: TSortOrder
  onSort: (field: TSortField, order: TSortOrder) => void
  onRetry: () => void
  onResetFilters: () => void
  onRowClick: (id: string) => void
}

const thClass = cn('px-4 py-3', textVariants.columnHeader)

const SkeletonRow = () => (
  <tr data-testid="alert-row-skeleton" className="border-b border-gray-100">
    {COLUMNS.map((col, i) => (
      <td key={col.key} className="px-4 py-3">
        <div className="h-4 animate-pulse rounded bg-gray-100" style={{ width: i === 1 || i === 2 ? '80%' : '60%' }} />
      </td>
    ))}
  </tr>
)

export const AlertTable = memo(function AlertTable({
  alerts,
  isLoading,
  isFetching,
  isError,
  sortField,
  sortOrder,
  onSort,
  onRetry,
  onResetFilters,
  onRowClick,
}: IAlertTableProps) {
  const handleHeaderClick = (field: TSortField) => {
    const nextOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc'
    onSort(field, nextOrder)
  }

  return (
    <div
      data-testid="alert-table-container"
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-opacity ${isFetching && !isLoading ? 'opacity-70' : 'opacity-100'}`}
    >
      <div className="overflow-x-auto">
        <table data-testid="alert-table" className="w-full text-left" role="grid" aria-label="Security alerts">
          <thead data-testid="alert-table-head">
            <tr className="border-b border-gray-200 bg-gray-50">
              {COLUMNS.map((col) => {
                const isActive = col.sortKey && sortField === col.sortKey
                return (
                  <th
                    key={col.key}
                    {...(col.headerTestId ? { 'data-testid': col.headerTestId } : {})}
                    className={col.headerClassName ?? cn(thClass, col.sortKey && 'cursor-pointer select-none hover:bg-gray-100')}
                    onClick={col.sortKey ? () => handleHeaderClick(col.sortKey!) : undefined}
                  >
                    {col.sortKey ? (
                      <span className="inline-flex items-center gap-1">
                        {col.header}
                        {isActive ? (
                          sortOrder === 'asc' ? <ChevronUp className="h-3.5 w-3.5 text-indigo-600" /> : <ChevronDown className="h-3.5 w-3.5 text-indigo-600" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-gray-300" />
                        )}
                      </span>
                    ) : (
                      col.header
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody data-testid="alert-table-body">
            {isLoading ? (
              [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
            ) : isError ? (
              <tr>
                <td colSpan={COLUMNS.length} data-testid="alert-table-error-state">
                  <ErrorState onRetry={onRetry} />
                </td>
              </tr>
            ) : alerts.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} data-testid="alert-table-empty-state">
                  <EmptyState
                    title="No alerts found"
                    description="No alerts match your current filters. Try adjusting your search or filters."
                    action={{ label: 'Reset filters', onClick: onResetFilters }}
                  />
                </td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <AlertRow key={alert.id} alert={alert} onClick={onRowClick} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {isFetching && !isLoading && (
        <div data-testid="alert-table-fetching-indicator" className="flex items-center justify-center gap-2 border-t border-gray-100 py-2 text-xs text-gray-400">
          <Spinner size="sm" />
          <span>Updating…</span>
        </div>
      )}
    </div>
  )
})
