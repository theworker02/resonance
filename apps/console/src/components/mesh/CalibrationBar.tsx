import { useMemo } from 'react'

interface CalibrationBarProps {
  score: number
  label: string
  showValue?: boolean
}

export function CalibrationBar({ score, label, showValue = true }: CalibrationBarProps) {
  const clamped = Math.max(0, Math.min(100, score))

  const color = useMemo(() => {
    if (clamped >= 80) return 'bg-green-500'
    if (clamped >= 60) return 'bg-amber-500'
    return 'bg-red-500'
  }, [clamped])

  const textColor = useMemo(() => {
    if (clamped >= 80) return 'text-green-400'
    if (clamped >= 60) return 'text-amber-400'
    return 'text-red-400'
  }, [clamped])

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-sm text-gray-300 w-44 shrink-0 truncate" title={label}>
        {label}
      </span>
      <div className="flex-1 h-2.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${clamped}%`}
        />
      </div>
      {showValue && (
        <span className={`text-sm font-mono w-12 text-right ${textColor}`}>
          {clamped.toFixed(0)}%
        </span>
      )}
    </div>
  )
}
