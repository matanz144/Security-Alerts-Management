import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmptyState } from '../EmptyState'

describe('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState title="No results" description="Try a different search." />)
    expect(screen.getByText('No results')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<EmptyState title="No results" description="Try a different search." />)
    expect(screen.getByText('Try a different search.')).toBeInTheDocument()
  })

  it('renders an action button when action prop is provided', () => {
    render(
      <EmptyState
        title="No results"
        description="No data."
        action={{ label: 'Reset filters', onClick: vi.fn() }}
      />,
    )
    expect(screen.getByRole('button', { name: 'Reset filters' })).toBeInTheDocument()
  })

  it('does not render a button when action prop is absent', () => {
    render(<EmptyState title="No results" description="No data." />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls action.onClick when the button is clicked', async () => {
    const onClick = vi.fn()
    render(
      <EmptyState
        title="No results"
        description="No data."
        action={{ label: 'Reset', onClick }}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
