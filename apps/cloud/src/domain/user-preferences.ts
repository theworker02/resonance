/**
 * User Preferences (Item 81-82)
 *
 * Per-user settings for timezone, units, theme, notifications,
 * default workspace, table density, and motion preferences.
 */

export interface UserPreferences {
  user_id: string
  timezone: string                    // IANA timezone, e.g. "America/New_York"
  units: 'metric' | 'imperial'
  theme: 'light' | 'dark' | 'system'
  density: 'compact' | 'default' | 'comfortable'
  reduced_motion: boolean
  default_workspace_id?: string
  notifications: NotificationPreferences
  updated_at: string
}

export interface NotificationPreferences {
  incident_created: boolean
  incident_reviewed: boolean
  node_offline: boolean
  deployment_degraded: boolean
  calibration_expired: boolean
  firmware_available: boolean
  security_alerts: boolean
  email_digest: 'none' | 'daily' | 'weekly'
}

export const DEFAULT_PREFERENCES: Omit<UserPreferences, 'user_id' | 'updated_at'> = {
  timezone: 'UTC',
  units: 'metric',
  theme: 'dark',
  density: 'default',
  reduced_motion: false,
  notifications: {
    incident_created: true,
    incident_reviewed: true,
    node_offline: true,
    deployment_degraded: true,
    calibration_expired: true,
    firmware_available: true,
    security_alerts: true,
    email_digest: 'daily',
  },
}

/**
 * Unit conversion utilities.
 * Canonical values are always metric internally.
 */
export const units = {
  distance: {
    toDisplay: (meters: number, system: 'metric' | 'imperial') =>
      system === 'metric'
        ? { value: meters, unit: 'm' }
        : { value: meters * 3.28084, unit: 'ft' },
    label: (system: 'metric' | 'imperial') => system === 'metric' ? 'metres' : 'feet',
  },
  temperature: {
    toDisplay: (celsius: number, system: 'metric' | 'imperial') =>
      system === 'metric'
        ? { value: celsius, unit: '°C' }
        : { value: celsius * 9/5 + 32, unit: '°F' },
    label: (system: 'metric' | 'imperial') => system === 'metric' ? '°C' : '°F',
  },
  speed: {
    toDisplay: (ms: number, system: 'metric' | 'imperial') =>
      system === 'metric'
        ? { value: ms, unit: 'm/s' }
        : { value: ms * 2.23694, unit: 'mph' },
    label: (system: 'metric' | 'imperial') => system === 'metric' ? 'm/s' : 'mph',
  },
  pressure: {
    toDisplay: (hpa: number, system: 'metric' | 'imperial') =>
      system === 'metric'
        ? { value: hpa, unit: 'hPa' }
        : { value: hpa * 0.02953, unit: 'inHg' },
    label: (system: 'metric' | 'imperial') => system === 'metric' ? 'hPa' : 'inHg',
  },
}
