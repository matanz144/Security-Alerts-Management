import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Spinner } from '../Spinner'

describe('Spinner', () => {
  it('renders with aria-label "Loading"', () => {
    render(<Spinner />)
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  })

  it('applies sm size class', () => {
    render(<Spinner size="sm" />)
    expect(screen.getByRole('status')).toHaveClass('h-4', 'w-4')
  })

  it('applies md size class by default', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toHaveClass('h-6', 'w-6')
  })

  it('applies lg size class', () => {
    render(<Spinner size="lg" />)
    expect(screen.getByRole('status')).toHaveClass('h-10', 'w-10')
  })

  it('forwards additional className', () => {
    render(<Spinner className="custom-class" />)
    expect(screen.getByRole('status')).toHaveClass('custom-class')
  })
})
