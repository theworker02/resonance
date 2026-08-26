import type { AcousticProbabilityField } from '../../types/mesh'

interface ApfVisualizationProps {
  field: AcousticProbabilityField
}

const barColors = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-purple-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-indigo-500',
]

export function ApfVisualization({ field }: ApfVisualizationProps) {
  // Sort regions by probability descending, append "outside" if > 0
  const entries = [
    ...field.regions.map((r) => ({
      label: r.label,
      probability: r.probability,
    })),
    ...(field.outside_probability > 0.01
      ? [{ label: 'Outside area', probability: field.outside_probability }]
      : []),
  ].sort((a, b) => b.probability - a.probability)

  const maxProb = Math.max(...entries.map((e) => e.probability), 0.01)

  return (
    <div className="space-y-2" role="list" aria-label="Acoustic Probability Field regions">
      {entries.map((entry, idx) => {
        const pct = (entry.probability * 100).toFixed(0)
        const barWidth = (entry.probability / maxProb) * 100
        const color = barColors[idx % barColors.length]

        return (
          <div key={entry.label} className="flex items-center gap-3" role="listitem">
            <span className="text-xs text-gray-300 w-36 shrink-0 truncate font-mono" title={entry.label}>
              {entry.label}
            </span>
            <div className="flex-1 h-4 bg-gray-800 rounded overflow-hidden">
              <div
                className={`h-full rounded ${color} transition-all duration-300`}
                style={{ width: `${barWidth}%` }}
              />
            </div>
            <span className="text-xs text-gray-300 font-mono w-10 text-right">
              {pct}%
            </span>
          </div>
        )
      })}

      {/* Summary */}
      {field.has_dominant_region && field.dominant_region_diameter_m !== null && (
        <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-700">
          Dominant region diameter: {field.dominant_region_diameter_m.toFixed(0)} m
        </p>
      )}
      {field.summary && (
        <p className="text-xs text-gray-400 italic">{field.summary}</p>
      )}
    </div>
  )
}
