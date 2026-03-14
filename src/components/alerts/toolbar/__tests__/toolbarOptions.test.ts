import { describe, it, expect } from 'vitest'
import {
  SEVERITY_OPTIONS,
  STATUS_OPTIONS,
  SORT_OPTIONS,
  isSeverity,
  isStatus,
} from '../toolbarOptions'
import type { TSeverity, TStatus } from '@/types/alert'

describe('SEVERITY_OPTIONS', () => {
  it('covers all TSeverity union members', () => {
    const values = SEVERITY_OPTIONS.map((o) => o.value)
    const expected: TSeverity[] = ['critical', 'high', 'medium', 'low']
    expect(values).toEqual(expect.arrayContaining(expected))
    expect(values).toHaveLength(expected.length)
  })

  it('each option has a non-empty label', () => {
    SEVERITY_OPTIONS.forEach((o) => {
      expect(o.label.length).toBeGreaterThan(0)
    })
  })
})

describe('STATUS_OPTIONS', () => {
  it('covers all TStatus union members', () => {
    const values = STATUS_OPTIONS.map((o) => o.value)
    const expected: TStatus[] = ['open', 'investigating', 'resolved']
    expect(values).toEqual(expect.arrayContaining(expected))
    expect(values).toHaveLength(expected.length)
  })

  it('each option has a non-empty label', () => {
    STATUS_OPTIONS.forEach((o) => {
      expect(o.label.length).toBeGreaterThan(0)
    })
  })
})

describe('SORT_OPTIONS', () => {
  it('contains four sort combinations', () => {
    expect(SORT_OPTIONS).toHaveLength(4)
  })

  it('each option has value, label, field, and order', () => {
    SORT_OPTIONS.forEach((o) => {
      expect(o).toHaveProperty('value')
      expect(o).toHaveProperty('label')
      expect(['createdAt', 'severity']).toContain(o.field)
      expect(['asc', 'desc']).toContain(o.order)
    })
  })

  it('covers all four field/order combinations', () => {
    const combinations = SORT_OPTIONS.map((o) => `${o.field}_${o.order}`)
    expect(combinations).toContain('createdAt_asc')
    expect(combinations).toContain('createdAt_desc')
    expect(combinations).toContain('severity_asc')
    expect(combinations).toContain('severity_desc')
  })
})

describe('isSeverity', () => {
  it('returns true for valid severity values', () => {
    expect(isSeverity('critical')).toBe(true)
    expect(isSeverity('high')).toBe(true)
    expect(isSeverity('medium')).toBe(true)
    expect(isSeverity('low')).toBe(true)
  })

  it('returns false for invalid values', () => {
    expect(isSeverity('unknown')).toBe(false)
    expect(isSeverity('')).toBe(false)
    expect(isSeverity('CRITICAL')).toBe(false)
  })
})

describe('isStatus', () => {
  it('returns true for valid status values', () => {
    expect(isStatus('open')).toBe(true)
    expect(isStatus('investigating')).toBe(true)
    expect(isStatus('resolved')).toBe(true)
  })

  it('returns false for invalid values', () => {
    expect(isStatus('closed')).toBe(false)
    expect(isStatus('')).toBe(false)
    expect(isStatus('OPEN')).toBe(false)
  })
})
