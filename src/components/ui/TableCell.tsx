import * as React from 'react'
import { cn } from '@/lib/utils'

interface ITableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  nowrap?: boolean
}

export const TableCell = ({ nowrap = true, className, children, ...props }: ITableCellProps) => {
  return (
    <td
      className={cn('px-4 py-3', nowrap && 'whitespace-nowrap', className)}
      {...props}
    >
      {children}
    </td>
  )
}
