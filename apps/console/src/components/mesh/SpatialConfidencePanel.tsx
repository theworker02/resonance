import type { SpatialConfidence, MeshSpatialTier } from '../../types/mesh'

interface SpatialConfidencePanelProps {
  confidence: SpatialConfidence
  tier?: MeshSpatialTier
}

interface DimensionRow {
  label: string
  value: number
}

function tierLabel(tier: MeshSpatialTier): string {
  switch (tier) {
    case 'high': return 'HIGH'
    case 'moderate': return 'MODERATE'
    case 'low': return 'LOW'
    case 'unresolved': return 'UNRESOLVED'
  }
}

function tierColor(tier: MeshSpatialTier): string {
  switch (tier) {
    case 'high': return 'text-green-400'
    case 'moderate': return 'text-amber-400'
    case 'low': return 'text-red-400'
    case 'unresolved': return 'text-gray-500'
  }
}

function barColor(value: number): string {
  if (value >= 0.80) return 'bg-green-500'
  if (value >= 0.60) return 'bg-amber-500'
  return 'bg-red-500'
}

export function SpatialConfidencePanel({ confidence, tier }: SpatialConfidencePanelProps) {
  const dimensions: DimensionRow[] = [
    { label: 'Spatial Region', value: confidence.spatial_region },
    { label: 'Temporal', value: confidence.temporal },
    { label: 'Sensor Health', value: confidence.sensor_health },
    { label: 'Environmental Model', value: confidence.environmental_model },
    { label: 'Direct Path Prob.', value: confidence.direct_path_probability },
    { label: 'Cross-sensor Similarity', value: confidence.cross_sensor_similarity },
  ]

  const overallTier = tier ?? (
    confidence.overall >= 0.80 ? 'high' :
    confidence.overall >= 0.60 ? 'moderate' :
    confidence.overall >= 0.40 ? 'low' : 'unresolved'
  )

  return (
    <div className="space-y-2.5" role="region" aria-label="Spatial confidence dimensions">
      {dimensions.map((dim) => {
        const pct = (dim.value * 100).toFixed(0)
        return (
          <div key={dim.label} className="flex items-center gap-3">
            <span className="text-xs text-gray-300 w-48 shrink-0">{dim.label}</span>
            <span className="text-xs font-mono text-gray-400 w-10 text-right">{pct}%</span>
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${barColor(dim.value)}`}
                style={{ width: `${dim.value * 100}%` }}
                role="progressbar"
                aria-valuenow={dim.value * 100}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${dim.label}: ${pct}%`}
              />
            </div>
          </div>
        )
      })}

      {/* Divider and overall */}
      <div className="border-t border-gray-700 pt-2 mt-2 flex items-center gap-3">
        <span className="text-xs text-gray-200 font-medium w-48 shrink-0">Overall</span>
        <span className="text-xs font-mono text-gray-200 w-10 text-right">
          {(confidence.overall * 100).toFixed(0)}%
        </span>
        <span className={`text-xs font-bold ${tierColor(overallTier)}`}>
          {tierLabel(overallTier)}
        </span>
      </div>
    </div>
  )
}
