import { useLocation } from 'react-router-dom'
import { Wifi, WifiOff } from 'lucide-react'
import { useLiveEvents } from '../../hooks/useLiveEvents'

const pageTitles: Record<string, string> = {
  '/':           'Overview',
  '/incidents':  'Incidents',
  '/sensors':    'Sensors',
  '/detectors':  'Detectors',
  '/models':     'Models',
  '/analytics':  'Analytics',
  '/audit':      'Audit Log',
  '/system':     'System',
}

export function TopBar() {
  const location = useLocation()
  const { isConnected } = useLiveEvents()

  const title =
    pageTitles[location.pathname] ??
    (location.pathname.startsWith('/incidents/') ? 'Incident Detail' :
     location.pathname.startsWith('/sensors/')   ? 'Sensor Detail'   : 'Resonance')

  return (
    <header className="h-12 bg-gray-900/40 border-b border-gray-800 flex items-center justify-between px-5 shrink-0">
      <h1 className="text-sm font-semibold text-gray-200">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Live connection indicator */}
        <div className="flex items-center gap-1.5 text-xs">
          {isConnected ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-green-400" aria-hidden="true" />
              <span className="text-green-400">Live</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />
              <span className="text-red-400">Reconnecting…</span>
            </>
          )}
        </div>

        {/* Version */}
        <span className="text-[11px] text-gray-600 font-mono">v0.5.0-alpha</span>
      </div>
    </header>
  )
}
