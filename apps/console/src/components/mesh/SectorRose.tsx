import type { SectorMap } from '../../types/mesh'

interface SectorRoseProps {
  sectorMap: SectorMap
}

const sectorPositions: Record<string, { top: string; left: string; transform: string }> = {
  N:  { top: '4%',  left: '50%', transform: 'translate(-50%, 0)' },
  NE: { top: '14%', left: '82%', transform: 'translate(-50%, 0)' },
  E:  { top: '48%', left: '92%', transform: 'translate(-50%, -50%)' },
  SE: { top: '78%', left: '82%', transform: 'translate(-50%, 0)' },
  S:  { top: '88%', left: '50%', transform: 'translate(-50%, 0)' },
  SW: { top: '78%', left: '18%', transform: 'translate(-50%, 0)' },
  W:  { top: '48%', left: '8%',  transform: 'translate(-50%, -50%)' },
  NW: { top: '14%', left: '18%', transform: 'translate(-50%, 0)' },
}

export function SectorRose({ sectorMap }: SectorRoseProps) {
  return (
    <div
      className="relative w-48 h-48 mx-auto"
      role="img"
      aria-label="Sector map compass rose showing active and blocked sectors"
    >
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-gray-500 -translate-x-1/2 -translate-y-1/2" />

      {/* Concentric rings */}
      <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full border border-gray-700 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-36 h-36 rounded-full border border-gray-700 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-44 h-44 rounded-full border border-gray-700 -translate-x-1/2 -translate-y-1/2" />

      {/* Cross lines */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-700/50" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-700/50" />

      {/* Sector labels */}
      {sectorMap.sectors.map((sector) => {
        const pos = sectorPositions[sector.label]
        if (!pos) return null
        const isUsable = sector.usable
        return (
          <div
            key={sector.label}
            className="absolute"
            style={{ top: pos.top, left: pos.left, transform: pos.transform }}
          >
            <div
              className={`
                text-xs font-bold px-2 py-1 rounded
                ${isUsable
                  ? 'bg-green-900/50 text-green-400 border border-green-700'
                  : 'bg-gray-800/50 text-gray-500 border border-gray-700'
                }
              `}
              title={isUsable ? `${sector.label}: Active` : `${sector.label}: Blocked`}
            >
              {sector.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
