import { Link } from 'react-router-dom'
import type { SpatialCell, CellStatus, CellMode } from '../../types/mesh'
import { CalibrationBar } from './CalibrationBar'

interface CellCardProps {
  cell: SpatialCell
}

const statusColors: Record<CellStatus, string> = {
  active: 'bg-green-600 text-green-100',
  degraded: 'bg-amber-600 text-amber-100',
  calibration_required: 'bg-purple-600 text-purple-100',
  inactive: 'bg-gray-600 text-gray-200',
}

const modeLabels: Record<CellMode, string> = {
  nominal: 'Nominal',
  degraded: 'Degraded',
  observation_only: 'Obs Only',
  unverified: 'Unverified',
  offline: 'Offline',
}

const modeColors: Record<CellMode, string> = {
  nominal: 'text-green-400',
  degraded: 'text-amber-400',
  observation_only: 'text-blue-400',
  unverified: 'text-purple-400',
  offline: 'text-gray-500',
}

export function CellCard({ cell }: CellCardProps) {
  const healthyNodes = cell.nodes.filter((n) => n.family === 'healthy').length
  const totalNodes = cell.nodes.length

  return (
    <Link
      to={`/cells/${cell.cell_id}`}
      className="block bg-gray-800/60 border border-gray-700 rounded-lg p-4 hover:border-gray-500 hover:bg-gray-800 transition-colors"
      aria-label={`Cell ${cell.label}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white font-mono">{cell.label}</h3>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase ${statusColors[cell.status]}`}
        >
          {cell.status.replace('_', ' ')}
        </span>
      </div>

      {/* Mode */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400">Mode</span>
        <span className={`text-xs font-medium ${modeColors[cell.mode]}`}>
          {modeLabels[cell.mode]}
        </span>
      </div>

      {/* Calibration */}
      <div className="mb-3">
        <CalibrationBar score={cell.calibration_score} label="Calibration" showValue />
      </div>

      {/* Node count */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Nodes</span>
        <span className="text-xs font-mono text-gray-200">
          <span className={healthyNodes === totalNodes ? 'text-green-400' : 'text-amber-400'}>
            {healthyNodes}
          </span>
          /{totalNodes} healthy
        </span>
      </div>
    </Link>
  )
}
