import clsx from 'clsx'
import type { ConfidenceLevel } from '../../types/incident'
import { confidenceLevelLabel } from '../../types/confidence'

interface Props {
  level: ConfidenceLevel
  score?: number
  size?: 'sm' | 'md' | 'lg'
}

export function ConfidenceBadge({ level, score, size = 'md' }: Props) {
  const colors: Record<ConfidenceLevel, string> = {
    HIGH: 'bg-green-500/20 text-green-300 ring-1 ring-green-500/40',
    NEEDS_VERIFICATION: 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40',
    REJECTED: 'bg-red-500/20 text-red-300 ring-1 ring-red-500/40',
  }

  const sizes = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        colors[level],
        sizes[size],
      )}
      aria-label={`Confidence: ${confidenceLevelLabel(level)}${score !== undefined ? ` (${Math.round(score * 100)}%)` : ''}`}
    >
      <span
        className={clsx('w-1.5 h-1.5 rounded-full', {
          'bg-green-400': level === 'HIGH',
          'bg-amber-400': level === 'NEEDS_VERIFICATION',
          'bg-red-400': level === 'REJECTED',
        })}
        aria-hidden="true"
      />
      {score !== undefined && (
        <span className="font-mono tabular-nums">{Math.round(score * 100)}%</span>
      )}
      <span>{confidenceLevelLabel(level)}</span>
    </span>
  )
}
