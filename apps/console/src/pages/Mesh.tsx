import { useState, useMemo } from 'react'
import type { SpatialCell, CellStatus } from '../types/mesh'
import { CellCard } from '../components/mesh/CellCard'

// Mock data — replaced by API call in production
const MOCK_CELLS: SpatialCell[] = Array.from({ length: 12 }, (_, i) => {
  const id = `cell-${String(i + 1).padStart(3, '0')}`
  const status: CellStatus = i < 8 ? 'active' : i < 10 ? 'degraded' : i < 11 ? 'calibration_required' : 'inactive'
  const modes = ['nominal', 'nominal', 'nominal', 'nominal', 'nominal', 'nominal', 'nominal', 'nominal', 'degraded', 'degraded', 'observation_only', 'offline'] as const
  return {
    cell_id: id,
    label: `RC-${String(200 + i).padStart(3, '0')}`,
    overlapping_cells: [],
    cluster_id: null,
    geometry: {
      boundary: [[51.5, -0.14], [51.5, -0.13], [51.49, -0.13], [51.49, -0.14]] as [number, number][],
      centroid: [51.495, -0.135] as [number, number],
      width_m: 280,
      height_m: 320,
    },
    sector_map: {
      cell_id: id,
      sectors: ['N','NE','E','SE','S','SW','W','NW'].map((label, j) => ({
        label,
        bearing_start_deg: j * 45,
        bearing_end_deg: (j + 1) * 45,
        usable: true,
      })),
    },
    nodes: Array.from({ length: 4 }, (_, j) => ({
      sensor_id: `sensor-${id}-${j}`,
      role: (['north_west', 'north_east', 'south_east', 'south_west'] as const)[j],
      family: j < (status === 'active' ? 4 : status === 'degraded' ? 3 : 2) ? 'healthy' as const : 'offline' as const,
      hardware_family: 'rn_edge' as const,
      lat: 51.495 + (j < 2 ? 0.002 : -0.002),
      lon: -0.135 + (j % 2 === 0 ? -0.002 : 0.002),
      heading_deg: j * 90,
      calibration_score: 80 + Math.random() * 18,
      health_score: status === 'inactive' ? 0 : 70 + Math.random() * 28,
      last_seen: new Date().toISOString(),
      firmware_version: '3.1.2',
    })),
    status,
    mode: modes[i],
    calibration_score: status === 'active' ? 85 + Math.random() * 14 : 50 + Math.random() * 30,
    created_at: '2024-09-01T00:00:00Z',
    updated_at: new Date().toISOString(),
  }
})

export default function MeshPage() {
  const [filter, setFilter] = useState<CellStatus | 'all'>('all')

  const cells = useMemo(() => {
    if (filter === 'all') return MOCK_CELLS
    return MOCK_CELLS.filter((c) => c.status === filter)
  }, [filter])

  const stats = useMemo(() => ({
    total: MOCK_CELLS.length,
    active: MOCK_CELLS.filter((c) => c.status === 'active').length,
    degraded: MOCK_CELLS.filter((c) => c.status === 'degraded').length,
    offline: MOCK_CELLS.filter((c) => c.status === 'inactive').length,
  }), [])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Spatial Acoustic Mesh</h1>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
        <StatItem label="Total Cells" value={stats.total} />
        <Divider />
        <StatItem label="Active" value={stats.active} color="text-green-400" />
        <Divider />
        <StatItem label="Degraded" value={stats.degraded} color="text-amber-400" />
        <Divider />
        <StatItem label="Offline" value={stats.offline} color="text-red-400" />
      </div>

      {/* Filter controls */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">Filter:</span>
        {(['all', 'active', 'degraded', 'calibration_required', 'inactive'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              filter === f
                ? 'border-resonance-500 text-resonance-300 bg-resonance-600/20'
                : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
            }`}
          >
            {f === 'all' ? 'All' : f.replace('_', ' ').replace(/^\w/, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Cell grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cells.map((cell) => (
          <CellCard key={cell.cell_id} cell={cell} />
        ))}
      </div>

      {cells.length === 0 && (
        <p className="text-gray-500 text-center py-12">No cells match the selected filter.</p>
      )}
    </div>
  )
}

function StatItem({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="text-center">
      <p className={`text-lg font-bold font-mono ${color ?? 'text-white'}`}>{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  )
}

function Divider() {
  return <div className="w-px h-8 bg-gray-700" />
}
