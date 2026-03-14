export type TSeverity = 'low' | 'medium' | 'high' | 'critical'
export type TStatus = 'open' | 'investigating' | 'resolved'
export type TSource = 'EDR' | 'SIEM' | 'Cloud' | 'Network' | 'Endpoint'
export type TSortField = 'createdAt' | 'severity'
export type TSortOrder = 'asc' | 'desc'

export interface IAlert {
  id: string
  title: string
  severity: TSeverity
  status: TStatus
  createdAt: string
  source: TSource
  description: string
}

export interface ITimelineEvent {
  id: string
  alertId: string
  event: string
  timestamp: string
}

export interface IAlertsQuery {
  page: number
  pageSize?: number
  severities: TSeverity[]
  statuses: TStatus[]
  search: string
  sortField: TSortField
  sortOrder: TSortOrder
}

export interface IAlertsResponse {
  data: IAlert[]
  total: number
  page: number
  pageSize: number
}

export type TAlertFilters = Omit<IAlertsQuery, 'page'>
