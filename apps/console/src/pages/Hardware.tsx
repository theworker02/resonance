import { useState, useMemo } from 'react'
import type { HardwareManifest, HardwareFamily } from '../types/mesh'

// Mock data
const MOCK_MANIFESTS: HardwareManifest[] = Array.from({ length: 18 }, (_, i) => {
  const families: HardwareFamily[] = ['rn_mini', 'rn_mini', 'rn_edge', 'rn_edge', 'rn_edge', 'rn_precision']
  const family = families[i % families.length]
  const micCounts: Record<HardwareFamily, number> = { rn_mini: 4, rn_edge: 8, rn_precision: 12 }
  return {
    sensor_id: `sensor-${String(i + 1).padStart(4, '0')}`,
    device_family: family,
    hardware_revision: family === 'rn_edge' ? 'Rev C' : family === 'rn_precision' ? 'Rev B' : 'Rev D',
    microphone_count: micCounts[family],
    has_npu: family !== 'rn_mini',
    has_gnss: family !== 'rn_mini',
    has_precision_pps: family !== 'rn_mini',
    has_environment_sensors: true,
    has_secure_element: family !== 'rn_mini',
    has_orientation_sensors: true,
    firmware_version: '3.1.2',
    generated_at: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
  }
})

export default function HardwarePage() {
  const [selected, setSelected] = useState<HardwareManifest | null>(null)

  const counts = useMemo(() => ({
    mini: MOCK_MANIFESTS.filter((m) => m.device_family === 'rn_mini').length,
    edge: MOCK_MANIFESTS.filter((m) => m.device_family === 'rn_edge').length,
    precision: MOCK_MANIFESTS.filter((m) => m.device_family === 'rn_precision').length,
  }), [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-white">Hardware Registry</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FamilyCard name="RN-Mini" count={counts.mini} mics={4} color="text-blue-400" />
        <FamilyCard name="RN-Edge" count={counts.edge} mics={8} color="text-emerald-400" />
        <FamilyCard name="RN-Precision" count={counts.precision} mics={12} color="text-purple-400" />
      </div>

      {/* Hardware table */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-auto">
        <table className="w-full text-xs min-w-[1000px]">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Sensor ID</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Family</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Revision</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Mics</th>
              <th className="text-center px-4 py-3 text-gray-400 font-medium">NPU</th>
              <th className="text-center px-4 py-3 text-gray-400 font-medium">GNSS</th>
              <th className="text-center px-4 py-3 text-gray-400 font-medium">Secure Element</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Firmware</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Last Manifest</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {MOCK_MANIFESTS.map((m) => (
              <tr
                key={m.sensor_id}
                className="hover:bg-gray-800 cursor-pointer"
                onClick={() => setSelected(m)}
              >
                <td className="px-4 py-3 font-mono text-resonance-300">{m.sensor_id}</td>
                <td className="px-4 py-3 text-gray-200 uppercase font-mono">{m.device_family.replace('_', '-')}</td>
                <td className="px-4 py-3 text-gray-300">{m.hardware_revision}</td>
                <td className="px-4 py-3 text-right text-gray-200 font-mono">{m.microphone_count}</td>
                <td className="px-4 py-3 text-center">{m.has_npu ? <Check /> : <Cross />}</td>
                <td className="px-4 py-3 text-center">{m.has_gnss ? <Check /> : <Cross />}</td>
                <td className="px-4 py-3 text-center">{m.has_secure_element ? <Check /> : <Cross />}</td>
                <td className="px-4 py-3 font-mono text-gray-400">{m.firmware_version}</td>
                <td className="px-4 py-3 text-gray-400">{formatDate(m.generated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {selected && (
        <ManifestModal manifest={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

function FamilyCard({ name, count, mics, color }: { name: string; count: number; mics: number; color: string }) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5">
      <p className={`text-lg font-bold font-mono ${color}`}>{count}</p>
      <p className="text-sm text-gray-200 font-medium">{name}</p>
      <p className="text-xs text-gray-500">{mics}-channel microphone array</p>
    </div>
  )
}

function ManifestModal({ manifest, onClose }: { manifest: HardwareManifest; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-label="Hardware manifest detail"
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-lg w-full space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Hardware Manifest</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close">
            &times;
          </button>
        </div>

        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
          <ManifestRow label="Sensor ID" value={manifest.sensor_id} />
          <ManifestRow label="Family" value={manifest.device_family.replace('_', '-').toUpperCase()} />
          <ManifestRow label="Hardware Rev" value={manifest.hardware_revision} />
          <ManifestRow label="Microphones" value={String(manifest.microphone_count)} />
          <ManifestRow label="NPU" value={manifest.has_npu ? 'Yes' : 'No'} />
          <ManifestRow label="GNSS" value={manifest.has_gnss ? 'Yes' : 'No'} />
          <ManifestRow label="Precision PPS" value={manifest.has_precision_pps ? 'Yes' : 'No'} />
          <ManifestRow label="Environment Sensors" value={manifest.has_environment_sensors ? 'Yes' : 'No'} />
          <ManifestRow label="Secure Element" value={manifest.has_secure_element ? 'Yes' : 'No'} />
          <ManifestRow label="Orientation Sensors" value={manifest.has_orientation_sensors ? 'Yes' : 'No'} />
          <ManifestRow label="Firmware" value={manifest.firmware_version} />
          <ManifestRow label="Generated" value={formatDate(manifest.generated_at)} />
        </div>
      </div>
    </div>
  )
}

function ManifestRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-200 font-mono">{value}</span>
    </>
  )
}

function Check() {
  return <span className="text-green-400 font-bold">&#10003;</span>
}

function Cross() {
  return <span className="text-gray-600">&#8212;</span>
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
