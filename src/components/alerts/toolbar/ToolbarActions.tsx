import { X, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

interface IToolbarActionsProps {
  totalResults: number
  hasActiveFilters: boolean
  onResetFilters: () => void
  onExportCsv: () => void
  isExporting?: boolean
  exportError?: string | null
}

export const ToolbarActions = ({
  totalResults,
  hasActiveFilters,
  onResetFilters,
  onExportCsv,
  isExporting = false,
  exportError = null,
}: IToolbarActionsProps) => (
  <div data-testid="alert-toolbar-actions" className="space-y-1">
    <div className="flex items-center justify-between">
      <p data-testid="alert-toolbar-results-count" className="text-xs text-gray-500">
        {totalResults === 0 ? 'No alerts found' : `${totalResults} alert${totalResults === 1 ? '' : 's'} found`}
        {hasActiveFilters && ' (filtered)'}
      </p>
      <div className="flex items-center gap-2">
        {hasActiveFilters && (
          <Button
            data-testid="alert-toolbar-reset-filters"
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Reset filters
          </Button>
        )}
        <Button
          data-testid="alert-toolbar-export-csv"
          variant="secondary"
          size="sm"
          onClick={onExportCsv}
          disabled={isExporting}
          title="Export to CSV"
        >
          {isExporting ? (
            <Spinner size="sm" />
          ) : (
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {isExporting ? 'Exporting…' : 'Export CSV'}
        </Button>
      </div>
    </div>
    {exportError && (
      <p role="alert" className="text-right text-xs text-red-600">
        {exportError}
      </p>
    )}
  </div>
)
