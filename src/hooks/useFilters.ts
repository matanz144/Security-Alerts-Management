import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { IAlertsQuery, TSeverity, TSortField, TSortOrder, TStatus } from '@/types/alert'

const PARAM_KEYS = {
  search: 'search',
  page: 'page',
  sortField: 'sortField',
  sortOrder: 'sortOrder',
  severity: 'severity',
  status: 'status',
} as const

const DEFAULT_SORT_FIELD: TSortField = 'createdAt'
const DEFAULT_SORT_ORDER: TSortOrder = 'desc'

export type IFiltersState = IAlertsQuery


export interface IFiltersActions {
  setSearch: (search: string) => void
  setSeverities: (severities: TSeverity[]) => void
  setStatuses: (statuses: TStatus[]) => void
  setSort: (field: TSortField, order: TSortOrder) => void
  setPage: (page: number) => void
  resetFilters: () => void
}

export const useFilters =(): IFiltersState & IFiltersActions => {
  const [searchParams, setSearchParams] = useSearchParams()

  const parsed = {
    search:    searchParams.get(PARAM_KEYS.search) ?? '',
    page:      parseInt(searchParams.get(PARAM_KEYS.page) ?? '1', 10),
    sortField: (searchParams.get(PARAM_KEYS.sortField) ?? DEFAULT_SORT_FIELD) as TSortField,
    sortOrder: (searchParams.get(PARAM_KEYS.sortOrder) ?? DEFAULT_SORT_ORDER) as TSortOrder,
    severity:  searchParams.getAll(PARAM_KEYS.severity) as TSeverity[],
    status:    searchParams.getAll(PARAM_KEYS.status) as TStatus[],
  } satisfies Record<keyof typeof PARAM_KEYS, unknown>

  const { search, page, sortField, sortOrder, severity: severities, status: statuses } = parsed

  const update = useCallback(
    (updater: (params: URLSearchParams) => void, resetPage = true) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (resetPage) next.set(PARAM_KEYS.page, '1')
        updater(next)
        return next
      })
    },
    [setSearchParams],
  )

  const setSearch = useCallback(
    (value: string) => {
      update((p) => {
        if (value) p.set(PARAM_KEYS.search, value)
        else p.delete(PARAM_KEYS.search)
      })
    },
    [update],
  )

  const setSeverities = useCallback(
    (values: TSeverity[]) => {
      update((p) => {
        p.delete(PARAM_KEYS.severity)
        values.forEach((v) => p.append(PARAM_KEYS.severity, v))
      })
    },
    [update],
  )

  const setStatuses = useCallback(
    (values: TStatus[]) => {
      update((p) => {
        p.delete(PARAM_KEYS.status)
        values.forEach((v) => p.append(PARAM_KEYS.status, v))
      })
    },
    [update],
  )

  const setSort = useCallback(
    (field: TSortField, order: TSortOrder) => {
      update((p) => {
        p.set(PARAM_KEYS.sortField, field)
        p.set(PARAM_KEYS.sortOrder, order)
      })
    },
    [update],
  )

  const setPage = useCallback(
    (value: number) => {
      update((p) => p.set(PARAM_KEYS.page, String(value)), false)
    },
    [update],
  )

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams())
  }, [setSearchParams])

  return {
    search,
    page,
    sortField,
    sortOrder,
    severities,
    statuses,
    setSearch,
    setSeverities,
    setStatuses,
    setSort,
    setPage,
    resetFilters,
  }
}
