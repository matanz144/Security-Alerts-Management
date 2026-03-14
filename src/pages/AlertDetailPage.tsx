import { ChevronLeft } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAlertById } from '@/hooks/useAlertById'
import { useAlertTimeline } from '@/hooks/useAlertTimeline'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { Text, textVariants } from '@/components/ui/Text'
import { formatDate, formatRelative } from '@/utils/dateFormat'

interface IDetailFieldProps {
  label: string
  value: string | React.ReactNode
}

const DetailField = ({ label, value }: IDetailFieldProps) => {
  return (
    <div>
      <dt className={textVariants.fieldLabel}>{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value}</dd>
    </div>
  )
}

export const AlertDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    data: alert,
    isLoading: alertLoading,
    isError: alertError,
    refetch: refetchAlert,
  } = useAlertById(id ?? '')

  const {
    data: timeline,
    isLoading: timelineLoading,
  } = useAlertTimeline(id ?? '')

  if (alertLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner size="lg" />
      </div>
    )
  }

  if (alertError || !alert) {
    return (
      <ErrorState
        title={alertError ? 'Failed to load alert' : 'Alert not found'}
        message={
          alertError
            ? 'An error occurred while fetching the alert details.'
            : `No alert found with ID "${id}".`
        }
        onRetry={alertError ? refetchAlert : undefined}
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="-ml-1 mt-0.5"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Button>
      </div>

      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge value={alert.severity} />
          <Badge value={alert.status} />
          <span className="font-mono text-xs text-gray-400">{alert.id}</span>
        </div>
        <Text variant="pageHeading">{alert.title}</Text>
        <Text variant="muted" className="mt-1">
          {formatRelative(alert.createdAt)} · {alert.source}
        </Text>
      </div>

      {/* Detail card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <Text variant="cardHeading" className="mb-5">Alert Details</Text>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          <DetailField label="ID" value={<span className="font-mono">{alert.id}</span>} />
          <DetailField label="Source" value={alert.source} />
          <DetailField label="Severity" value={<Badge value={alert.severity} />} />
          <DetailField label="Status" value={<Badge value={alert.status} />} />
          <DetailField label="Created At" value={formatDate(alert.createdAt)} />
          <div className="sm:col-span-2">
            <DetailField label="Description" value={alert.description} />
          </div>
        </dl>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <Text variant="cardHeading" className="mb-6">Activity Timeline</Text>

        {timelineLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Spinner size="sm" />
            <span>Loading timeline…</span>
          </div>
        ) : !timeline || timeline.length === 0 ? (
          <p className="text-sm text-gray-400">No timeline events found.</p>
        ) : (
          <ol aria-label="Alert activity timeline" className="relative ml-2 border-l border-gray-200">
            {timeline.map((event, idx) => (
              <li key={event.id} className="mb-6 ml-5 last:mb-0">
                <span
                  className={`absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${
                    idx === 0
                      ? 'bg-indigo-600'
                      : idx === timeline.length - 1
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                  }`}
                  aria-hidden="true"
                />
                <Text variant="strongBody" as="p">{event.event}</Text>
                <time
                  dateTime={event.timestamp}
                  className={`mt-0.5 block ${textVariants.timestamp}`}
                  title={formatDate(event.timestamp)}
                >
                  {formatDate(event.timestamp)}
                </time>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
