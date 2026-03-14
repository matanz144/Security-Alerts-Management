import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AlertTable } from '../AlertTable'
import { ALERT_FIXTURES } from '@/__tests__/fixtures/alerts'

const DEFAULT_PROPS = {
  alerts: ALERT_FIXTURES,
  isLoading: false,
  isFetching: false,
  isError: false,
  sortField: 'createdAt' as const,
  sortOrder: 'desc' as const,
  onSort: vi.fn(),
  onRetry: vi.fn(),
  onResetFilters: vi.fn(),
  onRowClick: vi.fn(),
}

describe('AlertTable', () => {
  it('renders a data row for each alert', () => {
    render(<AlertTable {...DEFAULT_PROPS} />)
    ALERT_FIXTURES.forEach((alert) => {
      expect(screen.getByTestId(`alert-row-${alert.id}`)).toBeInTheDocument()
    })
  })

  it('renders 8 skeleton rows when isLoading is true', () => {
    render(<AlertTable {...DEFAULT_PROPS} alerts={[]} isLoading={true} />)
    expect(screen.getAllByTestId('alert-row-skeleton')).toHaveLength(8)
  })

  it('renders the error state when isError is true', () => {
    render(<AlertTable {...DEFAULT_PROPS} alerts={[]} isError={true} />)
    expect(screen.getByTestId('alert-table-error-state')).toBeInTheDocument()
  })

  it('calls onRetry when the retry button in the error state is clicked', async () => {
    const onRetry = vi.fn()
    render(<AlertTable {...DEFAULT_PROPS} alerts={[]} isError={true} onRetry={onRetry} />)
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('renders the empty state when the alerts array is empty', () => {
    render(<AlertTable {...DEFAULT_PROPS} alerts={[]} />)
    expect(screen.getByTestId('alert-table-empty-state')).toBeInTheDocument()
    expect(screen.getByText('No alerts found')).toBeInTheDocument()
  })

  it('calls onResetFilters when the empty state reset button is clicked', async () => {
    const onResetFilters = vi.fn()
    render(<AlertTable {...DEFAULT_PROPS} alerts={[]} onResetFilters={onResetFilters} />)
    await userEvent.click(screen.getByRole('button', { name: 'Reset filters' }))
    expect(onResetFilters).toHaveBeenCalledOnce()
  })

  it('shows the fetching indicator when isFetching and not loading', () => {
    render(<AlertTable {...DEFAULT_PROPS} isFetching={true} isLoading={false} />)
    expect(screen.getByTestId('alert-table-fetching-indicator')).toBeInTheDocument()
  })

  it('does not show the fetching indicator when isLoading is true', () => {
    render(<AlertTable {...DEFAULT_PROPS} isFetching={true} isLoading={true} alerts={[]} />)
    expect(screen.queryByTestId('alert-table-fetching-indicator')).not.toBeInTheDocument()
  })

  it('does not show the fetching indicator when not fetching', () => {
    render(<AlertTable {...DEFAULT_PROPS} isFetching={false} />)
    expect(screen.queryByTestId('alert-table-fetching-indicator')).not.toBeInTheDocument()
  })
})
