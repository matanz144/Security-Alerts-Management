import { useCallback } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/MultiSelect'
import { SEVERITY_OPTIONS, STATUS_OPTIONS, SORT_OPTIONS, IToolbarProps, isSeverity, isStatus } from './toolbarOptions'
import { ToolbarActions } from './ToolbarActions'

interface IAlertToolbarProps extends IToolbarProps {
  totalResults: number
  onExportCsv: () => void
  isExporting?: boolean
  exportError?: string | null
}

export const AlertToolbar = ({
  filters,
  searchInput,
  onSearchChange,
  totalResults,
  onExportCsv,
  isExporting = false,
  exportError = null,
}: IAlertToolbarProps) => {
  const hasActiveFilters =
    filters.search !== '' || filters.severities.length > 0 || filters.statuses.length > 0

  const currentSort = `${filters.sortField}_${filters.sortOrder}`

  const handleSortChange = useCallback(
    (value: string | undefined) => {
      const opt = SORT_OPTIONS.find((o) => o.value === value)
      if (opt) filters.setSort(opt.field, opt.order)
    },
    [filters.setSort],
  )

  const handleSeveritiesChange = useCallback(
    (values: string[]) => {
      filters.setSeverities(values.filter(isSeverity))
    },
    [filters.setSeverities],
  )

  const handleStatusesChange = useCallback(
    (values: string[]) => {
      filters.setStatuses(values.filter(isStatus))
    },
    [filters.setStatuses],
  )

  return (
    <div data-testid="alert-toolbar" className="space-y-3">
      <div data-testid="alert-toolbar-filters" className="flex flex-wrap items-end gap-3">

        {/* Search */}
        <div data-testid="alert-toolbar-search" className="flex-1 min-w-[220px]">
          <Input
            id="alert-search"
            label="Search"
            placeholder="Search by title or description…"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
          />
        </div>

        {/* Severity filter */}
        <div data-testid="alert-toolbar-severity">
          <Select
            label="Severity"
            options={SEVERITY_OPTIONS}
            value={filters.severities}
            onChange={handleSeveritiesChange}
          />
        </div>

        {/* Status filter */}
        <div data-testid="alert-toolbar-status">
          <Select
            label="Status"
            options={STATUS_OPTIONS}
            value={filters.statuses}
            onChange={handleStatusesChange}
            placeholder="All statuses"
          />
        </div>

        {/* Sort */}
        <div data-testid="alert-toolbar-sort">
          <Select
            mode="single"
            label="Sort"
            options={SORT_OPTIONS}
            value={currentSort}
            onChange={handleSortChange}
            placeholder="Sort by..."
          />
        </div>

      </div>

      {/* Bottom row: results count + actions */}
      <ToolbarActions
        totalResults={totalResults}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={filters.resetFilters}
        onExportCsv={onExportCsv}
        isExporting={isExporting}
        exportError={exportError}
      />
    </div>
  )
}
