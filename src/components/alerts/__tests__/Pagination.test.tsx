import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from '../Pagination'

describe('Pagination', () => {
  it('returns null when total pages is 1 or less', () => {
    const { container } = render(
      <Pagination page={1} pageSize={20} total={15} onPageChange={vi.fn()} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders page info text', () => {
    render(<Pagination page={1} pageSize={10} total={25} onPageChange={vi.fn()} />)
    expect(screen.getByText(/Page/)).toBeInTheDocument()
  })

  it('renders the correct total pages', () => {
    render(<Pagination page={1} pageSize={10} total={25} onPageChange={vi.fn()} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows the showing range text', () => {
    render(<Pagination page={2} pageSize={10} total={25} onPageChange={vi.fn()} />)
    expect(screen.getByText(/Showing/)).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
  })

  it('disables Prev button on the first page', () => {
    render(<Pagination page={1} pageSize={10} total={25} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
  })

  it('disables Next button on the last page', () => {
    render(<Pagination page={3} pageSize={10} total={25} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })

  it('enables both buttons on middle pages', () => {
    render(<Pagination page={2} pageSize={10} total={30} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Previous page' })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next page' })).not.toBeDisabled()
  })

  it('calls onPageChange with page - 1 when Prev is clicked', async () => {
    const onPageChange = vi.fn()
    render(<Pagination page={3} pageSize={10} total={30} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Previous page' }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange with page + 1 when Next is clicked', async () => {
    const onPageChange = vi.fn()
    render(<Pagination page={1} pageSize={10} total={30} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
