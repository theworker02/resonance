import { useState, useMemo } from 'react'
import type { PropagationEdge } from '../types/mesh'

// Mock data
const MOCK_EDGES: (PropagationEdge & { cell_label: string })[] = Array.from({ length: 36 }, (_, i) => {
  const cellIdx = Math.floor(i / 6)
  const pairIdx = i % 6
  const pairs = [['nw','ne'],['nw','se'],['nw','sw'],['ne','se'],['ne','sw'],['se','sw']]
  const [a, b] = pairs[pairIdx]
  return {
    sensor_a: `sensor-${String(cellIdx * 4 + 1).padStart(4, '0')}`,
    sensor_b: `sensor-${String(cellIdx * 4 + pairIdx % 4 + 1).padStart(4, '0')}`,
    expected_tdoa_us: 100 + Math.random() * 300,
    tdoa_std_us: 8 + Math.random() * 25,
    co_detection_rate: 0.75 + Math.random() * 0.24,
    observation_count: Math.floor(800 + Math.random() * 2000),
    is_reliable: Math.random() > 0.2,
    cell_label: `RC-${String(200 + cellIdx).padStart(3, '0')}`,
  }
})

export default function PropagationPage() {
  const [cellFilter, setCellFilter] = useState<string>('all')

  const cells = useMemo(() => {
    const set = new Set(MOCK_EDGES.map((e) => e.cell_label))
    return ['all', ...Array.from(set).sort()]
  }, [])

  const edges = useMemo(() => {
    if (cellFilter === 'all') return MOCK_EDGES
    return MOCK_EDGES.filter((e) => e.cell_label === cellFilter)
  }, [cellFilter])

  // Summary stats
  const stats = useMemo(() => {
    const total = edges.length
    const reliable = edges.filter((e) => e.is_reliable).length
    const avgObs = edges.reduce((acc, e) => acc + e.observation_count, 0) / (total || 1)
    const avgStd = edges.reduce((acc, e) => acc + e.tdoa_std_us, 0) / (total || 1)
    return { total, reliable, reliableFrac: total > 0 ? reliable / total : 0, avgObs, avgStd }
  }, [edges])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-white">Propagation Model</h1>
      <p className="text-sm text-gray-400">
        WaveGraph edge table — learned acoustic propagation characteristics between sensor pairs.
      </p>

      {/* Summary stats */}
      <div className="flex items-center gap-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
        <StatBlock label="Total Edges" value={stats.total.toString()} />
        <Divider />
        <StatBlock label="Reliable" value={`${(stats.reliableFrac * 100).toFixed(0)}%`} color="text-green-400" />
        <Divider />
        <StatBlock label="Avg Observations" value={Math.round(stats.avgObs).toLocaleString()} />
        <Divider />
        <StatBlock label="Avg TDOA Std" value={`${stats.avgStd.toFixed(1)} µs`} />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">Cell:</span>
        <select
          value={cellFilter}
          onChange={(e) => setCellFilter(e.target.value)}
          className="text-xs bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-200"
          aria-label="Filter by cell"
        >
          {cells.map((c) => (
            <option key={c} value={c}>{c === 'all' ? 'All cells' : c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-auto">
        <table className="w-full text-xs min-w-[800px]">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Sensor A</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Sensor B</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Expected TDOA (µs)</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Std Dev (µs)</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Co-detection Rate</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Observations</th>
              <th className="text-center px-4 py-3 text-gray-400 font-medium">Reliable</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {edges.map((e, idx) => (
              <tr key={idx} className="hover:bg-gray-800">
                <td className="px-4 py-3 font-mono text-gray-200">{e.sensor_a}</td>
                <td className="px-4 py-3 font-mono text-gray-200">{e.sensor_b}</td>
                <td className="px-4 py-3 text-right font-mono text-gray-200">{e.expected_tdoa_us.toFixed(1)}</td>
                <td className="px-4 py-3 text-right font-mono text-gray-300">{e.tdoa_std_us.toFixed(1)}</td>
                <td className="px-4 py-3 text-right font-mono text-gray-300">{(e.co_detection_rate * 100).toFixed(0)}%</td>
                <td className="px-4 py-3 text-right font-mono text-gray-300">{e.observation_count.toLocaleString()}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block w-3 h-3 rounded-full ${
                    e.is_reliable ? 'bg-green-500' :
                    e.observation_count > 500 ? 'bg-amber-500' : 'bg-red-500'
                  }`} title={e.is_reliable ? 'Reliable' : e.observation_count > 500 ? 'Learning' : 'Unreliable'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatBlock({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="text-center">
      <p className={`text-sm font-bold font-mono ${color ?? 'text-white'}`}>{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  )
}

function Divider() {
  return <div className="w-px h-8 bg-gray-700" />
}
