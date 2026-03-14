import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Text } from '../Text'

describe('Text', () => {
  it('renders children content', () => {
    render(<Text variant="muted">Hello world</Text>)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('renders pageHeading as h1 by default', () => {
    render(<Text variant="pageHeading">Heading</Text>)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders cardHeading as h2 by default', () => {
    render(<Text variant="cardHeading">Card</Text>)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('renders muted as a <p> element by default', () => {
    const { container } = render(<Text variant="muted">Muted</Text>)
    expect(container.querySelector('p')).toBeInTheDocument()
  })

  it('renders timestamp as a <time> element by default', () => {
    const { container } = render(<Text variant="timestamp">Now</Text>)
    expect(container.querySelector('time')).toBeInTheDocument()
  })

  it('overrides the default element via the as prop', () => {
    const { container } = render(<Text variant="pageHeading" as="h2">Override</Text>)
    expect(container.querySelector('h2')).toBeInTheDocument()
    expect(container.querySelector('h1')).not.toBeInTheDocument()
  })

  it('applies the correct variant class', () => {
    render(<Text variant="pageHeading">Title</Text>)
    expect(screen.getByText('Title')).toHaveClass('text-2xl', 'font-bold')
  })
})
