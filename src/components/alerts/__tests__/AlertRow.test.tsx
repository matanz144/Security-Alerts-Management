import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AlertRow } from '../AlertRow'
import { ALERT_FIXTURES } from '@/__tests__/fixtures/alerts'

const ALERT = ALERT_FIXTURES[0]

function renderRow(onClick = vi.fn()) {
  return render(
    <table>
      <tbody>
        <AlertRow alert={ALERT} onClick={onClick} />
      </tbody>
    </table>,
  )
}

describe('AlertRow', () => {
  it('renders the alert id cell', () => {
    renderRow()
    expect(screen.getByTestId(`alert-cell-id-${ALERT.id}`)).toBeInTheDocument()
  })

  it('renders the alert title', () => {
    renderRow()
    expect(screen.getByText(ALERT.title)).toBeInTheDocument()
  })

  it('renders severity and status badge cells', () => {
    renderRow()
    expect(screen.getByTestId(`alert-cell-severity-${ALERT.id}`)).toBeInTheDocument()
    expect(screen.getByTestId(`alert-cell-status-${ALERT.id}`)).toBeInTheDocument()
  })

  it('renders the source', () => {
    renderRow()
    expect(screen.getByText(ALERT.source)).toBeInTheDocument()
  })

  it('has role="row" and an accessible aria-label', () => {
    renderRow()
    expect(screen.getByRole('row', { name: `Alert: ${ALERT.title}` })).toBeInTheDocument()
  })

  it('calls onClick with the alert id when the row is clicked', async () => {
    const onClick = vi.fn()
    renderRow(onClick)
    await userEvent.click(screen.getByRole('row', { name: `Alert: ${ALERT.title}` }))
    expect(onClick).toHaveBeenCalledWith(ALERT.id)
  })

  it('calls onClick when Enter key is pressed', async () => {
    const onClick = vi.fn()
    renderRow(onClick)
    const row = screen.getByRole('row', { name: `Alert: ${ALERT.title}` })
    row.focus()
    await userEvent.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledWith(ALERT.id)
  })

  it('calls onClick when Space key is pressed', async () => {
    const onClick = vi.fn()
    renderRow(onClick)
    const row = screen.getByRole('row', { name: `Alert: ${ALERT.title}` })
    row.focus()
    await userEvent.keyboard(' ')
    expect(onClick).toHaveBeenCalledWith(ALERT.id)
  })

  it('has tabIndex 0 for keyboard accessibility', () => {
    renderRow()
    expect(screen.getByRole('row', { name: `Alert: ${ALERT.title}` })).toHaveAttribute(
      'tabindex',
      '0',
    )
  })

  it('has aria-description to communicate interactivity to screen readers', () => {
    renderRow()
    expect(screen.getByRole('row', { name: `Alert: ${ALERT.title}` })).toHaveAttribute(
      'aria-description',
      'Press Enter or Space to view details',
    )
  })
})
