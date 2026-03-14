import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlerts } from '@/hooks/useAlerts'
import { useFilters } from '@/hooks/useFilters'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import { useExportCsv } from '@/hooks/useExportCsv'
import { AlertTable } from '@/components/alerts/AlertTable'
import { Pagination } from '@/components/alerts/Pagination'
import { AlertToolbar } from '@/components/alerts/toolbar/AlertToolbar'


export const AlertsListPage = () => {
  const navigate = useNavigate()
  const filters = useFilters()

  const query = useMemo(
    () => ({
      page: filters.page,
      severities: filters.severities,
      statuses: filters.statuses,
      search: filters.search,
      sortField: filters.sortField,
      sortOrder: filters.sortOrder,
    }),
    [filters.page, filters.severities, filters.statuses, filters.search, filters.sortField, filters.sortOrder],
  )

  const { data, isLoading, isFetching, isError, refetch } = useAlerts(query)

  const { inputValue: searchInput, onChange: setSearchInput } = useDebouncedSearch(filters.search, filters.setSearch)

  const handleRetry = useCallback(() => refetch(), [refetch])
  const handleRowClick = useCallback((id: string) => navigate(`/alerts/${id}`), [navigate])

  const { handleExportCsv, isExporting, exportError } = useExportCsv(query, data?.total ?? 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security Alerts</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor and manage security alerts across your infrastructure.
        </p>
      </div>

      <AlertToolbar
        filters={filters}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        totalResults={data?.total ?? 0}
        onExportCsv={handleExportCsv}
        isExporting={isExporting}
        exportError={exportError}
      />

      <AlertTable
        alerts={data?.data ?? []}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={handleRetry}
        onResetFilters={filters.resetFilters}
        onRowClick={handleRowClick}
      />

      {data && (
        <Pagination
          page={data.page}
          pageSize={data.pageSize}
          total={data.total}
          onPageChange={filters.setPage}
        />
      )}
    </div>
  )
}
