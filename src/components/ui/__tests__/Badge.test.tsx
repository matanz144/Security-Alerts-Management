import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../Badge'
import type { TSeverity, TStatus } from '@/types/alert'

describe('Badge', () => {
  const severities: TSeverity[] = ['critical', 'high', 'medium', 'low']
  const statuses: TStatus[] = ['open', 'investigating', 'resolved']

  severities.forEach((severity) => {
    it(`renders severity "${severity}" using the value as label by default`, () => {
      render(<Badge value={severity} />)
      expect(screen.getByText(severity)).toBeInTheDocument()
    })
  })

  statuses.forEach((status) => {
    it(`renders status "${status}" using the value as label by default`, () => {
      render(<Badge value={status} />)
      expect(screen.getByText(status)).toBeInTheDocument()
    })
  })

  it('renders a custom label when provided', () => {
    render(<Badge value="critical" label="CRITICAL ALERT" />)
    expect(screen.getByText('CRITICAL ALERT')).toBeInTheDocument()
    expect(screen.queryByText('critical')).not.toBeInTheDocument()
  })

  it('falls back to default styles for an unknown variant', () => {
    render(<Badge value={'unknown' as TSeverity} />)
    expect(screen.getByText('unknown')).toHaveClass('bg-gray-100')
  })
})
