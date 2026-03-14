import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToolbarActions } from '../ToolbarActions'

describe('ToolbarActions', () => {
  it('displays zero results message', () => {
    render(
      <ToolbarActions
        totalResults={0}
        hasActiveFilters={false}
        onResetFilters={vi.fn()}
        onExportCsv={vi.fn()}
      />,
    )
    expect(screen.getByTestId('alert-toolbar-results-count')).toHaveTextContent('No alerts found')
  })

  it('displays singular count for 1 alert', () => {
    render(
      <ToolbarActions
        totalResults={1}
        hasActiveFilters={false}
        onResetFilters={vi.fn()}
        onExportCsv={vi.fn()}
      />,
    )
    expect(screen.getByTestId('alert-toolbar-results-count')).toHaveTextContent('1 alert found')
  })

  it('displays plural count for multiple alerts', () => {
    render(
      <ToolbarActions
        totalResults={42}
        hasActiveFilters={false}
        onResetFilters={vi.fn()}
        onExportCsv={vi.fn()}
      />,
    )
    expect(screen.getByTestId('alert-toolbar-results-count')).toHaveTextContent('42 alerts found')
  })

  it('appends "(filtered)" when hasActiveFilters is true', () => {
    render(
      <ToolbarActions
        totalResults={5}
        hasActiveFilters={true}
        onResetFilters={vi.fn()}
        onExportCsv={vi.fn()}
      />,
    )
    expect(screen.getByTestId('alert-toolbar-results-count')).toHaveTextContent('(filtered)')
  })

  it('does not append "(filtered)" when hasActiveFilters is false', () => {
    render(
      <ToolbarActions
        totalResults={5}
        hasActiveFilters={false}
        onResetFilters={vi.fn()}
        onExportCsv={vi.fn()}
      />,
    )
    expect(screen.getByTestId('alert-toolbar-results-count')).not.toHaveTextContent('(filtered)')
  })

  it('shows Reset filters button when hasActiveFilters is true', () => {
    render(
      <ToolbarActions
        totalResults={5}
        hasActiveFilters={true}
        onResetFilters={vi.fn()}
        onExportCsv={vi.fn()}
      />,
    )
    expect(screen.getByTestId('alert-toolbar-reset-filters')).toBeInTheDocument()
  })

  it('hides Reset filters button when hasActiveFilters is false', () => {
    render(
      <ToolbarActions
        totalResults={5}
        hasActiveFilters={false}
        onResetFilters={vi.fn()}
        onExportCsv={vi.fn()}
      />,
    )
    expect(screen.queryByTestId('alert-toolbar-reset-filters')).not.toBeInTheDocument()
  })

  it('calls onResetFilters when Reset filters is clicked', async () => {
    const onResetFilters = vi.fn()
    render(
      <ToolbarActions
        totalResults={5}
        hasActiveFilters={true}
        onResetFilters={onResetFilters}
        onExportCsv={vi.fn()}
      />,
    )
    await userEvent.click(screen.getByTestId('alert-toolbar-reset-filters'))
    expect(onResetFilters).toHaveBeenCalledOnce()
  })

  it('always renders Export CSV button', () => {
    render(
      <ToolbarActions
        totalResults={0}
        hasActiveFilters={false}
        onResetFilters={vi.fn()}
        onExportCsv={vi.fn()}
      />,
    )
    expect(screen.getByTestId('alert-toolbar-export-csv')).toBeInTheDocument()
  })

  it('calls onExportCsv when Export CSV is clicked', async () => {
    const onExportCsv = vi.fn()
    render(
      <ToolbarActions
        totalResults={5}
        hasActiveFilters={false}
        onResetFilters={vi.fn()}
        onExportCsv={onExportCsv}
      />,
    )
    await userEvent.click(screen.getByTestId('alert-toolbar-export-csv'))
    expect(onExportCsv).toHaveBeenCalledOnce()
  })

  it('disables the Export CSV button and shows "Exporting…" when isExporting is true', () => {
    render(
      <ToolbarActions
        totalResults={5}
        hasActiveFilters={false}
        onResetFilters={vi.fn()}
        onExportCsv={vi.fn()}
        isExporting={true}
      />,
    )
    const btn = screen.getByTestId('alert-toolbar-export-csv')
    expect(btn).toBeDisabled()
    expect(btn).toHaveTextContent('Exporting…')
  })

  it('does not call onExportCsv when button is disabled during export', async () => {
    const onExportCsv = vi.fn()
    render(
      <ToolbarActions
        totalResults={5}
        hasActiveFilters={false}
        onResetFilters={vi.fn()}
        onExportCsv={onExportCsv}
        isExporting={true}
      />,
    )
    await userEvent.click(screen.getByTestId('alert-toolbar-export-csv'))
    expect(onExportCsv).not.toHaveBeenCalled()
  })

  it('shows export error message when exportError is provided', () => {
    render(
      <ToolbarActions
        totalResults={5}
        hasActiveFilters={false}
        onResetFilters={vi.fn()}
        onExportCsv={vi.fn()}
        exportError="Export failed. Please try again."
      />,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Export failed. Please try again.')
  })

  it('does not show an error message when exportError is null', () => {
    render(
      <ToolbarActions
        totalResults={5}
        hasActiveFilters={false}
        onResetFilters={vi.fn()}
        onExportCsv={vi.fn()}
        exportError={null}
      />,
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
