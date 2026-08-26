/**
 * CSS custom property definitions for Surface themes.
 * These are injected at the root level by the theme provider.
 */

export const darkThemeVars = {
  '--surface-bg-primary': '#0a0b0f',
  '--surface-bg-secondary': '#111318',
  '--surface-bg-tertiary': '#1a1d24',
  '--surface-bg-elevated': '#1f2229',
  '--surface-bg-overlay': 'rgba(0, 0, 0, 0.6)',
  '--surface-bg-inverse': '#f8f9fa',

  '--surface-text-primary': '#f0f2f5',
  '--surface-text-secondary': '#a0a8b8',
  '--surface-text-muted': '#5c6370',
  '--surface-text-inverse': '#111318',
  '--surface-text-link': '#5AD7FF',

  '--surface-border-default': '#2a2e38',
  '--surface-border-subtle': '#1e2128',
  '--surface-border-strong': '#3a3f4a',
  '--surface-border-focus': '#7667FF',

  '--surface-signal-info': '#5AD7FF',
  '--surface-signal-success': '#34D399',
  '--surface-signal-warning': '#FBBF24',
  '--surface-signal-critical': '#F87171',
  '--surface-signal-neutral': '#6B7280',

  '--surface-brand-primary': '#7667FF',
  '--surface-brand-secondary': '#5AD7FF',
  '--surface-brand-accent': '#FF6B4A',
} as const

export const lightThemeVars = {
  '--surface-bg-primary': '#ffffff',
  '--surface-bg-secondary': '#f8f9fb',
  '--surface-bg-tertiary': '#f0f2f5',
  '--surface-bg-elevated': '#ffffff',
  '--surface-bg-overlay': 'rgba(0, 0, 0, 0.3)',
  '--surface-bg-inverse': '#111318',

  '--surface-text-primary': '#111318',
  '--surface-text-secondary': '#4a5060',
  '--surface-text-muted': '#8890a0',
  '--surface-text-inverse': '#f0f2f5',
  '--surface-text-link': '#5B3FD9',

  '--surface-border-default': '#e2e5ea',
  '--surface-border-subtle': '#eef0f3',
  '--surface-border-strong': '#c8cdd5',
  '--surface-border-focus': '#7667FF',

  '--surface-signal-info': '#0EA5E9',
  '--surface-signal-success': '#10B981',
  '--surface-signal-warning': '#F59E0B',
  '--surface-signal-critical': '#EF4444',
  '--surface-signal-neutral': '#6B7280',

  '--surface-brand-primary': '#7667FF',
  '--surface-brand-secondary': '#0EA5E9',
  '--surface-brand-accent': '#FF6B4A',
} as const
