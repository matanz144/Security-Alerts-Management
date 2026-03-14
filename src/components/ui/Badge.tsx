import type { TSeverity, TStatus } from '@/types/alert'

type BadgeVariant = TSeverity | TStatus | 'default'

const variantClasses: Record<BadgeVariant, string> = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-blue-100 text-blue-700 border-blue-200',
  open: 'bg-red-100 text-red-700 border-red-200',
  investigating: 'bg-amber-100 text-amber-700 border-amber-200',
  resolved: 'bg-green-100 text-green-700 border-green-200',
  default: 'bg-gray-100 text-gray-700 border-gray-200',
}

interface IBadgeProps {
  value: BadgeVariant
  label?: string
}

export const Badge = ({ value, label }: IBadgeProps) => {
  const classes = variantClasses[value] ?? variantClasses.default
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${classes}`}
    >
      {label ?? value}
    </span>
  )
}
