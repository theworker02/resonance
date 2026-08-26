import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { SpatialCell, CellCalibrationState, CalibrationDimension } from '../types/mesh'
import { CalibrationBar } from '../components/mesh/CalibrationBar'
import { SectorRose } from '../components/mesh/SectorRose'

// Tabs
const TABS = ['Overview', 'Nodes', 'Calibration', 'Observations', 'Propagation'] as const
type Tab = typeof TABS[number]

// Mock cell
function getMockCell(id: string): SpatialCell {
  return {
    cell_id: id,
    label: 'RC-204',
    overlapping_cells: ['cell-003', 'cell-005', 'cell-020'],
    cluster_id: 'cluster-01',
    geometry: {
      boundary: [[51.501, -0.142], [51.501, -0.138], [51.497, -0.138], [51.497, -0.142]] as [number, number][],
      centroid: [51.499, -0.140] as [number, number],
      width_m: 280,
      height_m: 445,
    },
    sector_map: {
      cell_id: id,
      sectors: ['N','NE','E','SE','S','SW','W','NW'].map((label, j) => ({
        label,
        bearing_start_deg: j * 45,
        bearing_end_deg: (j + 1) * 45,
        usable: label !== 'SW',
      })),
    },
    nodes: [
      { sensor_id: 'sn-a1', role: 'north_west', family: 'healthy', hardware_family: 'rn_edge', lat: 51.501, lon: -0.142, heading_deg: 135, calibration_score: 96, health_score: 98, last_seen: new Date().toISOString(), firmware_version: '3.1.2' },
      { sensor_id: 'sn-a2', role: 'north_east', family: 'healthy', hardware_family: 'rn_edge', lat: 51.501, lon: -0.138, heading_deg: 225, calibration_score: 94, health_score: 97, last_seen: new Date().toISOString(), firmware_version: '3.1.2' },
      { sensor_id: 'sn-a3', role: 'south_east', family: 'healthy', hardware_family: 'rn_edge', lat: 51.497, lon: -0.138, heading_deg: 315, calibration_score: 92, health_score: 95, last_seen: new Date().toISOString(), firmware_version: '3.1.2' },
      { sensor_id: 'sn-a4', role: 'south_west', family: 'healthy', hardware_family: 'rn_edge', lat: 51.497, lon: -0.142, heading_deg: 45, calibration_score: 98, health_score: 99, last_seen: new Date().toISOString(), firmware_version: '3.1.2' },
    ],
    status: 'active',
    mode: 'nominal',
    calibration_score: 95,
    created_at: '2024-09-01T00:00:00Z',
    updated_at: new Date().toISOString(),
  }
}

function getMockCalibration(cellId: string): CellCalibrationState {
  const dims: Record<string, CalibrationDimension> = {
    timing_sync: { dimension: 'timing_sync', score: 97, status_message: 'All nodes within 10µs', needs_attention: false, last_evaluated: new Date().toISOString() },
    orientation: { dimension: 'orientation', score: 94, status_message: 'Heading deviation < 2°', needs_attention: false, last_evaluated: new Date().toISOString() },
    gain_balance: { dimension: 'gain_balance', score: 91, status_message: 'Channel balance nominal', needs_attention: false, last_evaluated: new Date().toISOString() },
    noise_floor: { dimension: 'noise_floor', score: 88, status_message: 'Below ambient threshold', needs_attention: false, last_evaluated: new Date().toISOString() },
    frequency_response: { dimension: 'frequency_response', score: 85, status_message: 'Within ±3 dB', needs_attention: false, last_evaluated: new Date().toISOString() },
    propagation_model: { dimension: 'propagation_model', score: 92, status_message: 'WaveGraph convergence met', needs_attention: false, last_evaluated: new Date().toISOString() },
    geometric_consistency: { dimension: 'geometric_consistency', score: 96, status_message: 'Position survey verified', needs_attention: false, last_evaluated: new Date().toISOString() },
  }
  return {
    cell_id: cellId,
    cell_label: 'RC-204',
    evaluated_at: new Date().toISOString(),
    dimension_scores: dims,
    composite_score: 92,
    requires_attention: false,
    attention_dimensions: [],
    contribution_weight: 1.0,
  }
}

export default function CellDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('Overview')

  const cell = getMockCell(id ?? 'unknown')
  const calibration = getMockCalibration(cell.cell_id)

  const healthyNodes = cell.nodes.filter((n) => n.family === 'healthy').length

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link to="/mesh" className="hover:text-gray-200">Mesh</Link>
        <span>/</span>
        <span className="text-gray-200">{cell.label}</span>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white font-mono">{cell.label}</h1>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium uppercase ${
          cell.status === 'active' ? 'bg-green-600 text-green-100' :
          cell.status === 'degraded' ? 'bg-amber-600 text-amber-100' :
          'bg-gray-600 text-gray-200'
        }`}>
          {cell.status.replace('_', ' ')}
        </span>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 flex gap-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-resonance-500 text-resonance-300'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'Overview' && (
        <OverviewTab cell={cell} healthyNodes={healthyNodes} calibration={calibration} />
      )}
      {activeTab === 'Nodes' && <NodesTab cell={cell} />}
      {activeTab === 'Calibration' && <CalibrationTab calibration={calibration} />}
      {activeTab === 'Observations' && <ObservationsTab />}
      {activeTab === 'Propagation' && <PropagationTab />}
    </div>
  )
}

// ─── Overview Tab ───────────────────────────────────────────────────────────

function OverviewTab({
  cell,
  healthyNodes,
  calibration,
}: {
  cell: SpatialCell
  healthyNodes: number
  calibration: CellCalibrationState
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Properties */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 space-y-3">
        <h2 className="text-sm font-bold text-white mb-4">Properties</h2>
        <PropertyRow label="Geometry" value="Rectangular" />
        <PropertyRow label="Mode" value={cell.mode.toUpperCase().replace('_', ' ')} />
        <PropertyRow label="Status" value={cell.status.replace('_', ' ')} />
        <PropertyRow label="Nodes" value={`${healthyNodes}/${cell.nodes.length} healthy`} />
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 w-36">Calibration</span>
          <div className="flex-1">
            <CalibrationBar score={calibration.composite_score} label="" />
          </div>
        </div>
        <PropertyRow label="Network" value="Healthy" />
        <PropertyRow label="Environmental" value="Current" />
        <PropertyRow label="Recent obs." value="42" />
        <PropertyRow label="Verified inc." value="3" />
      </div>

      {/* Sector Map */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5">
        <h2 className="text-sm font-bold text-white mb-4">Sector Map</h2>
        <SectorRose sectorMap={cell.sector_map} />
        <div className="mt-4 pt-4 border-t border-gray-700">
          <span className="text-xs text-gray-400">Overlapping cells:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {cell.overlapping_cells.map((oc) => (
              <span key={oc} className="text-xs font-mono px-2 py-0.5 bg-gray-700 rounded text-gray-300">
                {oc}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PropertyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 w-36">{label}</span>
      <span className="text-xs text-gray-200 font-mono">{value}</span>
    </div>
  )
}

// ─── Nodes Tab ──────────────────────────────────────────────────────────────

function NodesTab({ cell }: { cell: SpatialCell }) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
      <table className="w-full text-xs">
        <thead className="bg-gray-900/50">
          <tr>
            <th className="text-left px-4 py-3 text-gray-400 font-medium">Sensor ID</th>
            <th className="text-left px-4 py-3 text-gray-400 font-medium">Role</th>
            <th className="text-left px-4 py-3 text-gray-400 font-medium">Hardware</th>
            <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">Health</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">Calibration</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">Heading</th>
            <th className="text-left px-4 py-3 text-gray-400 font-medium">Firmware</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {cell.nodes.map((node) => (
            <tr key={node.sensor_id} className="hover:bg-gray-800">
              <td className="px-4 py-3 font-mono text-gray-200">{node.sensor_id}</td>
              <td className="px-4 py-3 text-gray-300 capitalize">{node.role.replace('_', ' ')}</td>
              <td className="px-4 py-3 text-gray-300 uppercase">{node.hardware_family.replace('_', '-')}</td>
              <td className="px-4 py-3">
                <StatusBadge status={node.family} />
              </td>
              <td className="px-4 py-3 text-right font-mono text-gray-200">{node.health_score.toFixed(0)}%</td>
              <td className="px-4 py-3 text-right font-mono text-gray-200">{node.calibration_score.toFixed(0)}%</td>
              <td className="px-4 py-3 text-right font-mono text-gray-300">{node.heading_deg}°</td>
              <td className="px-4 py-3 font-mono text-gray-400">{node.firmware_version}</td>
            </tr>
          ))}
        </tbody>
      </table>
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

// ─── Calibration Tab ────────────────────────────────────────────────────────

function CalibrationTab({ calibration }: { calibration: CellCalibrationState }) {
  const dims = Object.values(calibration.dimension_scores)
  return (
    <div className="space-y-6">
      {/* Composite score */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5">
        <h2 className="text-sm font-bold text-white mb-4">Composite Calibration Score</h2>
        <CalibrationBar score={calibration.composite_score} label="Composite" />
        <p className="text-xs text-gray-400 mt-3">
          Contribution weight: {calibration.contribution_weight.toFixed(2)}
        </p>
      </div>

      {/* Dimension bars */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 space-y-3">
        <h2 className="text-sm font-bold text-white mb-4">Calibration Dimensions</h2>
        {dims.map((dim) => (
          <div key={dim.dimension} className="space-y-1">
            <CalibrationBar
              score={dim.score}
              label={dim.dimension.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}
            />
            <p className="text-[10px] text-gray-500 ml-48 pl-3">{dim.status_message}</p>
          </div>
        ))}
      </div>

      {/* Attention items */}
      {calibration.requires_attention && (
        <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-5">
          <h2 className="text-sm font-bold text-amber-400 mb-2">Needs Attention</h2>
          <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
            {calibration.attention_dimensions.map((d) => (
              <li key={d}>{d.replace(/_/g, ' ')}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ─── Observations Tab ───────────────────────────────────────────────────────

function ObservationsTab() {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
      <p className="text-gray-400 text-sm">Recent acoustic observations for this cell.</p>
      <p className="text-gray-500 text-xs mt-2">42 observations in the last 24 hours.</p>
      <div className="mt-6 grid grid-cols-3 gap-4 max-w-md mx-auto text-xs">
        <div className="bg-gray-700/50 rounded p-3">
          <p className="text-white font-bold">42</p>
          <p className="text-gray-400">Total</p>
        </div>
        <div className="bg-gray-700/50 rounded p-3">
          <p className="text-green-400 font-bold">38</p>
          <p className="text-gray-400">Correlated</p>
        </div>
        <div className="bg-gray-700/50 rounded p-3">
          <p className="text-amber-400 font-bold">4</p>
          <p className="text-gray-400">Unverified</p>
        </div>
      </div>
    </div>
  )
}

// ─── Propagation Tab ────────────────────────────────────────────────────────

function PropagationTab() {
  const edges = [
    { a: 'sn-a1', b: 'sn-a2', tdoa: 145.2, std: 12.4, codet: 0.94, obs: 1842, reliable: true },
    { a: 'sn-a1', b: 'sn-a3', tdoa: 287.8, std: 18.1, codet: 0.89, obs: 1756, reliable: true },
    { a: 'sn-a1', b: 'sn-a4', tdoa: 198.4, std: 14.7, codet: 0.91, obs: 1801, reliable: true },
    { a: 'sn-a2', b: 'sn-a3', tdoa: 201.1, std: 15.3, codet: 0.92, obs: 1789, reliable: true },
    { a: 'sn-a2', b: 'sn-a4', tdoa: 291.3, std: 19.8, codet: 0.87, obs: 1634, reliable: true },
    { a: 'sn-a3', b: 'sn-a4', tdoa: 152.6, std: 11.9, codet: 0.95, obs: 1867, reliable: true },
  ]

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
      <table className="w-full text-xs">
        <thead className="bg-gray-900/50">
          <tr>
            <th className="text-left px-4 py-3 text-gray-400 font-medium">Sensor A</th>
            <th className="text-left px-4 py-3 text-gray-400 font-medium">Sensor B</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">TDOA (µs)</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">Std Dev (µs)</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">Co-detect Rate</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">Observations</th>
            <th className="text-center px-4 py-3 text-gray-400 font-medium">Reliable</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {edges.map((e) => (
            <tr key={`${e.a}-${e.b}`} className="hover:bg-gray-800">
              <td className="px-4 py-3 font-mono text-gray-200">{e.a}</td>
              <td className="px-4 py-3 font-mono text-gray-200">{e.b}</td>
              <td className="px-4 py-3 text-right font-mono text-gray-200">{e.tdoa.toFixed(1)}</td>
              <td className="px-4 py-3 text-right font-mono text-gray-300">{e.std.toFixed(1)}</td>
              <td className="px-4 py-3 text-right font-mono text-gray-300">{(e.codet * 100).toFixed(0)}%</td>
              <td className="px-4 py-3 text-right font-mono text-gray-300">{e.obs.toLocaleString()}</td>
              <td className="px-4 py-3 text-center">
                <span className={`inline-block w-2 h-2 rounded-full ${e.reliable ? 'bg-green-500' : 'bg-red-500'}`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
