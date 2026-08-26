import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import {
  LayoutDashboard,
  AlertTriangle,
  Radio,
  Cpu,
  Brain,
  BarChart3,
  ScrollText,
  Settings,
  Radar,
  Hexagon,
  Grid3X3,
  CircuitBoard,
  Waves,
  SlidersHorizontal,
  HardDrive,
} from 'lucide-react'

interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavSection {
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    items: [
      { to: '/',           label: 'Overview',    icon: LayoutDashboard },
      { to: '/incidents',  label: 'Incidents',   icon: AlertTriangle },
    ],
  },
  {
    items: [
      { to: '/mesh',       label: 'Mesh',        icon: Hexagon },
      { to: '/cells',      label: 'Cells',       icon: Grid3X3 },
      { to: '/nodes',      label: 'Nodes',       icon: CircuitBoard },
    ],
  },
  {
    items: [
      { to: '/sensors',    label: 'Sensors',     icon: Radio },
      { to: '/detectors',  label: 'Detectors',   icon: Cpu },
      { to: '/models',     label: 'Models',      icon: Brain },
    ],
  },
  {
    items: [
      { to: '/propagation', label: 'Propagation', icon: Waves },
      { to: '/calibration', label: 'Calibration', icon: SlidersHorizontal },
      { to: '/hardware',    label: 'Hardware',    icon: HardDrive },
    ],
  },
  {
    items: [
      { to: '/analytics',  label: 'Analytics',   icon: BarChart3 },
      { to: '/audit',      label: 'Audit',       icon: ScrollText },
      { to: '/system',     label: 'System',      icon: Settings },
    ],
  },
]

export function Sidebar() {
  return (
    <aside
      className="w-56 shrink-0 bg-gray-900/60 border-r border-gray-800 flex flex-col"
      aria-label="Primary navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-800">
        <div className="w-7 h-7 rounded-full bg-resonance-600 flex items-center justify-center shrink-0">
          <Radar className="w-4 h-4 text-white" aria-hidden="true" />
        </div>
        <div>
          <span className="text-sm font-bold text-white tracking-wide">Resonance</span>
          <span className="block text-[10px] text-gray-500 font-mono">v0.6.0</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto" role="navigation">
        {navSections.map((section, sIdx) => (
          <div key={sIdx}>
            {sIdx > 0 && <div className="my-2 mx-3 border-t border-gray-800" />}
            {section.items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors group',
                    isActive
                      ? 'bg-resonance-600/30 text-resonance-300 font-medium'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800',
                  )
                }
                aria-label={label}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-800">
        <p className="text-[10px] text-gray-600 font-mono">Apache 2.0 • Open Source</p>
      </div>
    </aside>
  )
}
