import { Fragment, memo } from 'react'
import type { IAlert } from '@/types/alert'
import { COLUMNS } from '@/components/alerts/alertColumns'

export interface IAlertRowProps {
  alert: IAlert
  onClick: (id: string) => void
}

export const AlertRow = memo(({ alert, onClick }: IAlertRowProps) => {
  const handleClick = () => onClick(alert.id)

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') onClick(alert.id)
    }


  return (
    <tr
      data-testid={`alert-row-${alert.id}`}
      className="group cursor-pointer border-b border-gray-100 transition-colors hover:bg-indigo-50/40"
      onClick={handleClick}
      tabIndex={0}
      role="row"
      aria-label={`Alert: ${alert.title}`}
      aria-description="Press Enter or Space to view details"
      onKeyDown={handleKeyDown}
    >
      {COLUMNS.map((col) => (
        <Fragment key={col.key}>{col.renderCell(alert)}</Fragment>
      ))}
    </tr>
  )
})
