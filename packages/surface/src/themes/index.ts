/**
 * Surface Theme System
 *
 * Supports: Light, Dark, System (auto-detect)
 */

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeConfig {
  mode: ThemeMode
  density: 'compact' | 'default' | 'comfortable'
  reducedMotion: boolean
  radius: 'none' | 'sm' | 'md' | 'lg'
}

export const defaultThemeConfig: ThemeConfig = {
  mode: 'dark',
  density: 'default',
  reducedMotion: false,
  radius: 'md',
}

export function resolveThemeMode(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'dark'
  }
  return mode
}
