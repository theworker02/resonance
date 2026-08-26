import clsx from 'clsx'
import type { IncidentStatus } from '../../types/incident'
import type { SensorStatus } from '../../types/sensor'

type AnyStatus = IncidentStatus | SensorStatus

const statusConfig: Record<AnyStatus, { label: string; classes: string }> = {
  // Incident statuses
  pending_review:   { label: 'Pending Review',  classes: 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40' },
  confirmed:        { label: 'Confirmed',        classes: 'bg-green-500/20 text-green-300 ring-1 ring-green-500/40' },
  review_rejected:  { label: 'Review Rejected',  classes: 'bg-red-500/20 text-red-300 ring-1 ring-red-500/40' },
  auto_rejected:    { label: 'Auto Rejected',    classes: 'bg-gray-500/20 text-gray-400 ring-1 ring-gray-500/40' },
  escalated:        { label: 'Escalated',        classes: 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/40' },
  // Sensor statuses
  healthy:          { label: 'Healthy',          classes: 'bg-green-500/20 text-green-300 ring-1 ring-green-500/40' },
  degraded:         { label: 'Degraded',         classes: 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40' },
  offline:          { label: 'Offline',          classes: 'bg-red-500/20 text-red-300 ring-1 ring-red-500/40' },
  maintenance:      { label: 'Maintenance',      classes: 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/40' },
}

interface Props {
  status: AnyStatus
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'md' }: Props) {
  const config = statusConfig[status] ?? { label: status, classes: 'bg-gray-500/20 text-gray-400' }

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        config.classes,
        size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1',
      )}
    >
      {config.label}
    </span>
  )
}
