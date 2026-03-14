import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../Input'

function renderInput(overrides = {}) {
  const props = {
    id: 'search-input',
    value: '',
    onChange: vi.fn(),
    ...overrides,
  }
  return render(<Input {...props} />)
}

describe('Input', () => {
  it('renders the input element', () => {
    renderInput()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders a label when label prop is provided', () => {
    renderInput({ label: 'Search' })
    expect(screen.getByLabelText('Search')).toBeInTheDocument()
  })

  it('associates label with input via htmlFor and id', () => {
    renderInput({ label: 'Search', id: 'test-id' })
    const label = screen.getByText('Search')
    expect(label).toHaveAttribute('for', 'test-id')
  })

  it('displays the provided value', () => {
    renderInput({ value: 'hello' })
    expect(screen.getByRole('textbox')).toHaveValue('hello')
  })

  it('calls onChange when the user types', async () => {
    const onChange = vi.fn()
    renderInput({ onChange })
    await userEvent.type(screen.getByRole('textbox'), 'x')
    expect(onChange).toHaveBeenCalled()
  })

  it('shows the clear button when value is non-empty and onClear is provided', () => {
    renderInput({ value: 'foo', onClear: vi.fn() })
    expect(screen.getByRole('button', { name: 'clear search' })).toBeInTheDocument()
  })

  it('does not show the clear button when value is empty', () => {
    renderInput({ value: '', onClear: vi.fn() })
    expect(screen.queryByRole('button', { name: 'clear search' })).not.toBeInTheDocument()
  })

  it('does not show the clear button when onClear is not provided', () => {
    renderInput({ value: 'foo' })
    expect(screen.queryByRole('button', { name: 'clear search' })).not.toBeInTheDocument()
  })

  it('calls onClear when the clear button is clicked', async () => {
    const onClear = vi.fn()
    renderInput({ value: 'foo', onClear })
    await userEvent.click(screen.getByRole('button', { name: 'clear search' }))
    expect(onClear).toHaveBeenCalledOnce()
  })

  it('renders placeholder text', () => {
    renderInput({ placeholder: 'Type here…' })
    expect(screen.getByPlaceholderText('Type here…')).toBeInTheDocument()
  })
})
