import type { TSortField, TSortOrder, TSeverity, TStatus } from '@/types/alert'
import type { IFiltersActions, IFiltersState } from '@/hooks/useFilters'

export const SEVERITY_OPTIONS = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'investigating', label: 'Investigating' },
  { value: 'resolved', label: 'Resolved' },
]

export const SORT_OPTIONS: { value: string; label: string; field: TSortField; order: TSortOrder }[] = [
  { value: 'createdAt_desc', label: 'Newest first', field: 'createdAt', order: 'desc' },
  { value: 'createdAt_asc', label: 'Oldest first', field: 'createdAt', order: 'asc' },
  { value: 'severity_desc', label: 'Severity: High → Low', field: 'severity', order: 'desc' },
  { value: 'severity_asc', label: 'Severity: Low → High', field: 'severity', order: 'asc' },
]

const severityValues = new Set(SEVERITY_OPTIONS.map((o) => o.value))
const statusValues = new Set(STATUS_OPTIONS.map((o) => o.value))

export function isSeverity(value: string): value is TSeverity {
  return severityValues.has(value)
}

export function isStatus(value: string): value is TStatus {
  return statusValues.has(value)
}

export interface IToolbarProps {
  filters: IFiltersState & IFiltersActions
  searchInput: string
  onSearchChange: (value: string) => void
}