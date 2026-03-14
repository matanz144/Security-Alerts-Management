import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select } from '../MultiSelect'

const OPTIONS = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
]

describe('Select (multi mode)', () => {
  it('renders the trigger button with the label as accessible name', () => {
    render(<Select label="Severity" options={OPTIONS} value={[]} onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Severity' })).toBeInTheDocument()
  })

  it('renders a visible label element associated with the button', () => {
    render(<Select label="Severity" options={OPTIONS} value={[]} onChange={vi.fn()} />)
    expect(screen.getByText('Severity', { selector: 'label' })).toBeInTheDocument()
  })

  it('shows placeholder text when no values are selected', () => {
    render(
      <Select label="Severity" options={OPTIONS} value={[]} onChange={vi.fn()} placeholder="All severities" />,
    )
    expect(screen.getByRole('button', { name: 'Severity' })).toHaveTextContent('All severities')
  })

  it('shows the label as placeholder when no placeholder prop and nothing selected', () => {
    render(<Select label="Severity" options={OPTIONS} value={[]} onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Severity' })).toHaveTextContent('Severity')
  })

  it('shows the option label when one item is selected', () => {
    render(<Select label="Severity" options={OPTIONS} value={['critical']} onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Severity' })).toHaveTextContent('Critical')
  })

  it('shows "N selected" when multiple items are selected', () => {
    render(
      <Select label="Severity" options={OPTIONS} value={['critical', 'high']} onChange={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: 'Severity' })).toHaveTextContent('2 selected')
  })

  it('opens the dropdown when the trigger is clicked', async () => {
    render(<Select label="Severity" options={OPTIONS} value={[]} onChange={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: 'Severity' }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    OPTIONS.forEach((o) => expect(screen.getByText(o.label)).toBeInTheDocument())
  })

  it('calls onChange with the new value when an option is clicked', async () => {
    const onChange = vi.fn()
    render(<Select label="Severity" options={OPTIONS} value={[]} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Severity' }))
    await userEvent.click(screen.getByText('Critical'))
    expect(onChange).toHaveBeenCalledWith(['critical'])
  })

  it('removes the value when an already-selected option is clicked', async () => {
    const onChange = vi.fn()
    render(<Select label="Severity" options={OPTIONS} value={['critical']} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Severity' }))
    await userEvent.click(within(screen.getByRole('listbox')).getByText('Critical'))
    expect(onChange).toHaveBeenCalledWith([])
  })

  it('closes the dropdown when clicking outside', async () => {
    render(
      <div>
        <Select label="Severity" options={OPTIONS} value={[]} onChange={vi.fn()} />
        <button>outside</button>
      </div>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Severity' }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'outside' }))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})

describe('Select (single mode)', () => {
  it('shows the selected option label', () => {
    render(
      <Select mode="single" label="Sort" options={OPTIONS} value="critical" onChange={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: 'Sort' })).toHaveTextContent('Critical')
  })

  it('calls onChange with the value when an option is clicked', async () => {
    const onChange = vi.fn()
    render(
      <Select mode="single" label="Sort" options={OPTIONS} value={undefined} onChange={onChange} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Sort' }))
    await userEvent.click(screen.getByText('High'))
    expect(onChange).toHaveBeenCalledWith('high')
  })

  it('calls onChange with undefined when the selected option is clicked again (deselect)', async () => {
    const onChange = vi.fn()
    render(
      <Select mode="single" label="Sort" options={OPTIONS} value="high" onChange={onChange} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Sort' }))
    await userEvent.click(within(screen.getByRole('listbox')).getByText('High'))
    expect(onChange).toHaveBeenCalledWith(undefined)
  })

  it('closes the dropdown after selecting an option', async () => {
    render(
      <Select mode="single" label="Sort" options={OPTIONS} value={undefined} onChange={vi.fn()} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Sort' }))
    await userEvent.click(screen.getByText('Medium'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
