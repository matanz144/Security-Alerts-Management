import * as React from 'react'
import { cn } from '@/lib/utils'

export const textVariants = {
  formLabel:    'text-xs font-medium text-gray-600',
  columnHeader: 'text-xs font-semibold uppercase tracking-wide text-gray-500',
  fieldLabel:   'text-xs font-medium uppercase tracking-wide text-gray-400',
  muted:        'text-sm text-gray-500',
  timestamp:    'text-xs text-gray-400',
  pageHeading:  'text-2xl font-bold text-gray-900',
  cardHeading:  'text-sm font-semibold text-gray-700',
  strongBody:   'text-sm font-medium text-gray-900',
} as const

export type TextVariant = keyof typeof textVariants

const defaultElement: Record<TextVariant, keyof React.JSX.IntrinsicElements> = {
  formLabel:    'span',
  columnHeader: 'span',
  fieldLabel:   'dt',
  muted:        'p',
  timestamp:    'time',
  pageHeading:  'h1',
  cardHeading:  'h2',
  strongBody:   'span',
}

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant: TextVariant
  as?: keyof React.JSX.IntrinsicElements
  children: React.ReactNode
}

export const Text = ({ variant, as, className, children, ...props }: TextProps) => {
  const Tag = (as ?? defaultElement[variant]) as React.ElementType
  return (
    <Tag className={cn(textVariants[variant], className)} {...props}>
      {children}
    </Tag>
  )
}
