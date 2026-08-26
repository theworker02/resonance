import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { CellNode, NodeFamily, HardwareFamily } from '../types/mesh'

interface NodeListItem extends CellNode {
  cell_label: string
}

// Mock data
const MOCK_NODES: NodeListItem[] = Array.from({ length: 24 }, (_, i) => {
  const families: NodeFamily[] = ['healthy', 'healthy', 'healthy', 'healthy', 'healthy', 'healthy', 'degraded', 'offline']
  const hw: HardwareFamily[] = ['rn_edge', 'rn_edge', 'rn_edge', 'rn_mini', 'rn_precision']
  const roles = ['north_west', 'north_east', 'south_east', 'south_west'] as const
  return {
    sensor_id: `sensor-${String(i + 1).padStart(4, '0')}`,
    role: roles[i % 4],
    family: families[i % families.length],
    hardware_family: hw[i % hw.length],
    lat: 51.495 + (Math.random() - 0.5) * 0.01,
    lon: -0.135 + (Math.random() - 0.5) * 0.01,
    heading_deg: Math.round(Math.random() * 360),
    calibration_score: 70 + Math.random() * 28,
    health_score: families[i % families.length] === 'offline' ? 0 : 75 + Math.random() * 24,
    last_seen: families[i % families.length] === 'offline' ? null : new Date(Date.now() - Math.random() * 60000).toISOString(),
    firmware_version: '3.1.2',
    cell_label: `RC-${String(200 + Math.floor(i / 4)).padStart(3, '0')}`,
  }
})

export default function NodesPage() {
  const [statusFilter, setStatusFilter] = useState<NodeFamily | 'all'>('all')
  const [hwFilter, setHwFilter] = useState<HardwareFamily | 'all'>('all')

  const nodes = useMemo(() => {
    let result = MOCK_NODES
    if (statusFilter !== 'all') {
      result = result.filter((n) => n.family === statusFilter)
    }
    if (hwFilter !== 'all') {
      result = result.filter((n) => n.hardware_family === hwFilter)
    }
    return result
  }, [statusFilter, hwFilter])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-white">Node Registry</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as NodeFamily | 'all')}
            className="text-xs bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-200"
            aria-label="Filter by node status"
          >
            <option value="all">All</option>
            <option value="healthy">Healthy</option>
            <option value="degraded">Degraded</option>
            <option value="offline">Offline</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Hardware:</span>
          <select
            value={hwFilter}
            onChange={(e) => setHwFilter(e.target.value as HardwareFamily | 'all')}
            className="text-xs bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-200"
            aria-label="Filter by hardware family"
          >
            <option value="all">All</option>
            <option value="rn_mini">RN-Mini</option>
            <option value="rn_edge">RN-Edge</option>
            <option value="rn_precision">RN-Precision</option>
          </select>
        </div>
        <span className="text-xs text-gray-500 ml-auto">{nodes.length} nodes</span>
      </div>

      {/* Table */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-auto">
        <table className="w-full text-xs min-w-[900px]">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Sensor ID</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Hardware</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Health</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Calibration</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Cell</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Last Seen</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Firmware</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {nodes.map((node) => (
              <tr key={node.sensor_id} className="hover:bg-gray-800 cursor-pointer">
                <td className="px-4 py-3">
                  <Link to={`/sensors/${node.sensor_id}`} className="font-mono text-resonance-300 hover:underline">
                    {node.sensor_id}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-300 uppercase font-mono">
                  {node.hardware_family.replace('_', '-')}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={node.family} />
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-200">
                  {node.health_score > 0 ? `${node.health_score.toFixed(0)}%` : '—'}
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-200">
                  {node.calibration_score.toFixed(0)}%
                </td>
                <td className="px-4 py-3 font-mono text-gray-300">{node.cell_label}</td>
                <td className="px-4 py-3 text-gray-400">
                  {node.last_seen ? formatRelativeTime(node.last_seen) : '—'}
                </td>
                <td className="px-4 py-3 font-mono text-gray-400">{node.firmware_version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    healthy: 'bg-green-600/30 text-green-300',
    degraded: 'bg-amber-600/30 text-amber-300',
    offline: 'bg-red-600/30 text-red-300',
    maintenance: 'bg-purple-600/30 text-purple-300',
  }
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${colors[status] ?? colors.offline}`}>
      {status}
    </span>
  )
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 60_000) return 'Just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
  return `${Math.floor(diff / 86_400_000)}d ago`
}
