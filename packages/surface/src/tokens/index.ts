/**
 * Surface Design Tokens
 *
 * All visual values are defined here as semantic tokens.
 * Components MUST NOT hard-code colors, spacing, or typography.
 */

// ─── Colors ──────────────────────────────────────────────────────────────────

export const colors = {
  // Backgrounds
  bg: {
    primary: 'var(--surface-bg-primary)',
    secondary: 'var(--surface-bg-secondary)',
    tertiary: 'var(--surface-bg-tertiary)',
    elevated: 'var(--surface-bg-elevated)',
    overlay: 'var(--surface-bg-overlay)',
    inverse: 'var(--surface-bg-inverse)',
  },
  // Text
  text: {
    primary: 'var(--surface-text-primary)',
    secondary: 'var(--surface-text-secondary)',
    muted: 'var(--surface-text-muted)',
    inverse: 'var(--surface-text-inverse)',
    link: 'var(--surface-text-link)',
  },
  // Borders
  border: {
    default: 'var(--surface-border-default)',
    subtle: 'var(--surface-border-subtle)',
    strong: 'var(--surface-border-strong)',
    focus: 'var(--surface-border-focus)',
  },
  // Signals (semantic)
  signal: {
    info: 'var(--surface-signal-info)',
    success: 'var(--surface-signal-success)',
    warning: 'var(--surface-signal-warning)',
    critical: 'var(--surface-signal-critical)',
    neutral: 'var(--surface-signal-neutral)',
  },
  // Brand
  brand: {
    primary: 'var(--surface-brand-primary)',      // Resonance Violet
    secondary: 'var(--surface-brand-secondary)',  // Signal Cyan
    accent: 'var(--surface-brand-accent)',
  },
} as const

// ─── Spacing ─────────────────────────────────────────────────────────────────

export const spacing = {
  '0': '0',
  '1': '0.25rem',   // 4px
  '2': '0.5rem',    // 8px
  '3': '0.75rem',   // 12px
  '4': '1rem',      // 16px
  '5': '1.25rem',   // 20px
  '6': '1.5rem',    // 24px
  '8': '2rem',      // 32px
  '10': '2.5rem',   // 40px
  '12': '3rem',     // 48px
  '16': '4rem',     // 64px
  '20': '5rem',     // 80px
  '24': '6rem',     // 96px
} as const

// ─── Typography ──────────────────────────────────────────────────────────────

export const typography = {
  fontFamily: {
    sans: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
  letterSpacing: {
    tight: '-0.01em',
    normal: '0',
    wide: '0.02em',
    wider: '0.05em',
  },
} as const

// ─── Radius ──────────────────────────────────────────────────────────────────

export const radius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  full: '9999px',
} as const

// ─── Elevation (shadows) ─────────────────────────────────────────────────────

export const elevation = {
  none: 'none',
  sm: '0 1px 2px rgba(0,0,0,0.1)',
  md: '0 4px 8px rgba(0,0,0,0.12)',
  lg: '0 8px 24px rgba(0,0,0,0.16)',
  xl: '0 16px 48px rgba(0,0,0,0.2)',
} as const

// ─── Density ─────────────────────────────────────────────────────────────────

export const density = {
  compact: { padding: spacing['2'], gap: spacing['1'], fontSize: typography.fontSize.xs },
  default: { padding: spacing['3'], gap: spacing['2'], fontSize: typography.fontSize.sm },
  comfortable: { padding: spacing['4'], gap: spacing['3'], fontSize: typography.fontSize.base },
} as const

// ─── Z-index ─────────────────────────────────────────────────────────────────

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  popover: 400,
  toast: 500,
  command: 600,
} as const
