/**
 * Resonance Plugin SDK — third-party extension contract.
 *
 * Plugins implement this interface and export a manifest.
 * The platform loads, validates, and sandboxes plugins automatically.
 */

export interface PluginContext {
  /** Read acoustic features for the current event. */
  getFeatures(): Promise<AcousticFeatureInput>
  /** Read incident data (if permitted). */
  getIncident(id: string): Promise<IncidentSnapshot | null>
  /** Read current environment context. */
  getEnvironment(): Promise<EnvironmentSnapshot>
  /** Log a message (routed to platform observability). */
  log(level: 'debug' | 'info' | 'warn' | 'error', message: string): void
}

export interface AcousticFeatureInput {
  mfcc: number[]
  spectral_centroid_hz: number
  spectral_rolloff_hz: number
  zero_crossing_rate: number
  peak_energy_db: number
  snr_db: number
  envelope: number[]
  waveprint_hash: string
  duration_ms: number
}

export interface IncidentSnapshot {
  id: string
  status: string
  classification: string
  confidence: number
  observation_count: number
  created_at: string
}

export interface EnvironmentSnapshot {
  temperature_c: number
  humidity_pct: number
  pressure_hpa: number
  wind_speed_ms: number
  wind_bearing_deg: number
  speed_of_sound_ms: number
}

/**
 * Base class for Resonance plugins.
 * All plugin types extend this.
 */
export abstract class ResonancePlugin {
  abstract readonly name: string
  abstract readonly version: string

  /** Called once when the plugin is loaded. */
  abstract initialize(ctx: PluginContext): Promise<void>

  /** Called when the plugin is being unloaded. */
  async dispose(): Promise<void> { /* default no-op */ }

  /** Health check — return true if the plugin is functioning. */
  abstract health(): boolean
}

/**
 * Detector plugin — analyzes acoustic features and produces classifications.
 */
export abstract class DetectorPlugin extends ResonancePlugin {
  abstract readonly supportedClasses: string[]

  abstract analyze(features: AcousticFeatureInput): Promise<{
    classification: string
    confidence: number
    alternatives: Array<{ class: string; confidence: number }>
  }>
}

/**
 * Integration plugin — sends data to external systems.
 */
export abstract class IntegrationPlugin extends ResonancePlugin {
  abstract onIncidentCreated(incident: IncidentSnapshot): Promise<void>
  abstract onIncidentReviewed(incident: IncidentSnapshot, disposition: string): Promise<void>
}

/**
 * Exporter plugin — formats and delivers evidence bundles.
 */
export abstract class ExporterPlugin extends ResonancePlugin {
  abstract readonly outputFormat: string
  abstract export(incidentId: string, ctx: PluginContext): Promise<Uint8Array>
}
