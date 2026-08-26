/**
 * Surface Component Contracts
 *
 * These define the interface every Surface component must satisfy.
 * Implementations live in the console app; contracts live here.
 */

// ─── Core ────────────────────────────────────────────────────────────────────

export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
}

export interface BadgeProps {
  variant: 'info' | 'success' | 'warning' | 'critical' | 'neutral'
  size?: 'sm' | 'md'
  children: React.ReactNode
}

export interface CardProps {
  elevated?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

// ─── Data Display ────────────────────────────────────────────────────────────

export interface DataTableColumn<T> {
  key: string
  header: string
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (row: T) => React.ReactNode
  sortable?: boolean
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  virtualized?: boolean
  onRowClick?: (row: T) => void
}

export interface MetricCardProps {
  label: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
  status?: 'info' | 'success' | 'warning' | 'critical'
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  commands: CommandItem[]
  onSelect: (command: CommandItem) => void
}

export interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  shortcut?: string
  category: string
  action: () => void
}

// ─── Feedback ────────────────────────────────────────────────────────────────

export interface EmptyStateProps {
  title: string
  description: string
  action?: { label: string; onClick: () => void }
  icon?: React.ReactNode
}

export interface LoadingSkeletonProps {
  lines?: number
  width?: string
  height?: string
  variant?: 'text' | 'card' | 'table'
}

export interface ErrorRecoveryProps {
  title: string
  description: string
  actions: Array<{ label: string; onClick: () => void; variant?: 'primary' | 'secondary' }>
}

// ─── Visualization ───────────────────────────────────────────────────────────

export interface ConfidenceCurveProps {
  data: Array<{ time_ms: number; confidence: number; event?: string }>
  height?: number
  interactive?: boolean
}

export interface HealthGaugeProps {
  score: number
  label: string
  size?: 'sm' | 'md' | 'lg'
}

export interface DirectionPlotProps {
  azimuth_deg: number
  uncertainty_deg: number
  size?: number
  showLabels?: boolean
}

export interface TimelineProps {
  events: Array<{ timestamp: string; label: string; detail?: string; type?: string }>
  orientation?: 'vertical' | 'horizontal'
}

export interface EvidenceGraphProps {
  nodes: Array<{ id: string; type: string; label: string }>
  edges: Array<{ from: string; to: string; label?: string; strength?: number }>
}
