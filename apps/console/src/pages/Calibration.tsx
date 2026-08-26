import { useMemo } from 'react'
import type { CellCalibrationState, CalibrationDimension } from '../types/mesh'
import { CalibrationBar } from '../../../../console/src/components/mesh/CalibrationBar'

// Mock data
const MOCK_CALIBRATIONS: CellCalibrationState[] = Array.from({ length: 12 }, (_, i) => {
  const makeDim = (dim: string, base: number): CalibrationDimension => ({
    dimension: dim,
    score: base + Math.random() * 15,
    status_message: base > 75 ? 'Nominal' : 'Below threshold',
    needs_attention: base < 70,
    last_evaluated: new Date().toISOString(),
  })

  const base = 55 + i * 3.5
  const dims: Record<string, CalibrationDimension> = {
    timing_sync: makeDim('timing_sync', base + 10),
    orientation: makeDim('orientation', base + 5),
    gain_balance: makeDim('gain_balance', base),
    noise_floor: makeDim('noise_floor', base + 3),
    frequency_response: makeDim('frequency_response', base - 2),
    propagation_model: makeDim('propagation_model', base + 7),
    geometric_consistency: makeDim('geometric_consistency', base + 12),
  }

  const scores = Object.values(dims).map((d) => d.score)
  const composite = scores.reduce((a, b) => a + b, 0) / scores.length
  const attention = Object.values(dims).filter((d) => d.needs_attention).map((d) => d.dimension)

  return {
    cell_id: `cell-${String(i + 1).padStart(3, '0')}`,
    cell_label: `RC-${String(200 + i).padStart(3, '0')}`,
    evaluated_at: new Date().toISOString(),
    dimension_scores: dims,
    composite_score: composite,
    requires_attention: attention.length > 0,
    attention_dimensions: attention,
    contribution_weight: composite > 80 ? 1.0 : composite > 60 ? 0.7 : 0.4,
  }
})

export default function CalibrationPage() {
  // Sort worst first
  const sorted = useMemo(
    () => [...MOCK_CALIBRATIONS].sort((a, b) => a.composite_score - b.composite_score),
    []
  )

  const fleetScore = useMemo(
    () => sorted.reduce((acc, c) => acc + c.composite_score, 0) / (sorted.length || 1),
    [sorted]
  )

  const needsAttention = sorted.filter((c) => c.requires_attention).length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Fleet Calibration</h1>
        <button
          className="text-xs px-3 py-1.5 border border-gray-700 rounded text-gray-300 hover:border-gray-500 hover:text-white transition-colors"
          aria-label="Export calibration data"
        >
          Export CSV
        </button>
      </div>

      {/* Fleet score */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm text-gray-300">Fleet Calibration Score</h2>
          <span className="text-xs text-gray-400">{sorted.length} cells evaluated</span>
        </div>
        <CalibrationBar score={fleetScore} label="Fleet Mean" />
        {needsAttention > 0 && (
          <p className="text-xs text-amber-400 mt-3">
            {needsAttention} cell{needsAttention > 1 ? 's' : ''} require attention.
          </p>
        )}
      </div>

      {/* Cell calibration table */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-auto">
        <table className="w-full text-xs min-w-[900px]">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Cell</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Composite</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Timing</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Orientation</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Gain</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Noise</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Freq Resp</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Propagation</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Geometry</th>
              <th className="text-center px-4 py-3 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sorted.map((cal) => (
              <tr
                key={cal.cell_id}
                className={`hover:bg-gray-800 ${cal.requires_attention ? 'bg-amber-900/10' : ''}`}
              >
                <td className="px-4 py-3 font-mono text-gray-200 font-medium">{cal.cell_label}</td>
                <td className="px-4 py-3 text-right">
                  <ScoreCell score={cal.composite_score} />
                </td>
                <td className="px-4 py-3 text-right">
                  <ScoreCell score={cal.dimension_scores.timing_sync?.score ?? 0} />
                </td>
                <td className="px-4 py-3 text-right">
                  <ScoreCell score={cal.dimension_scores.orientation?.score ?? 0} />
                </td>
                <td className="px-4 py-3 text-right">
                  <ScoreCell score={cal.dimension_scores.gain_balance?.score ?? 0} />
                </td>
                <td className="px-4 py-3 text-right">
                  <ScoreCell score={cal.dimension_scores.noise_floor?.score ?? 0} />
                </td>
                <td className="px-4 py-3 text-right">
                  <ScoreCell score={cal.dimension_scores.frequency_response?.score ?? 0} />
                </td>
                <td className="px-4 py-3 text-right">
                  <ScoreCell score={cal.dimension_scores.propagation_model?.score ?? 0} />
                </td>
                <td className="px-4 py-3 text-right">
                  <ScoreCell score={cal.dimension_scores.geometric_consistency?.score ?? 0} />
                </td>
                <td className="px-4 py-3 text-center">
                  {cal.requires_attention ? (
                    <span className="text-amber-400 font-medium">{cal.attention_dimensions.length}</span>
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ScoreCell({ score }: { score: number }) {
  const color = score >= 80 ? 'text-green-400' : score >= 60 ? 'text-amber-400' : 'text-red-400'
  return <span className={`font-mono ${color}`}>{score.toFixed(0)}%</span>
}
