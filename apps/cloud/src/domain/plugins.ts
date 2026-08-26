/**
 * Plugin Architecture (Items 121-124)
 *
 * Plugin classes: detector, integration, exporter, analytics, visualization
 * Explicit capability permissions. Sandboxed execution.
 */

export type PluginClass = 'detector' | 'integration' | 'exporter' | 'analytics' | 'visualization'

export interface PluginManifest {
  name: string
  version: string
  description: string
  author: string
  license: string
  class: PluginClass
  capabilities: PluginCapability[]
  network: { allowed: boolean; hosts?: string[] }
  entry: string
  signature?: string
}

export type PluginCapability =
  | 'acoustic.features.read'
  | 'acoustic.waveprint.read'
  | 'incident.read'
  | 'incident.write'
  | 'node.health.read'
  | 'environment.read'
  | 'model.inference'
  | 'storage.read'
  | 'storage.write'
  | 'network.outbound'

export type PluginState = 'installed' | 'enabled' | 'disabled' | 'errored' | 'updating'

export interface InstalledPlugin {
  id: string
  manifest: PluginManifest
  state: PluginState
  installed_at: string
  updated_at: string
  error?: string
  workspace_id: string
}

/**
 * Sandbox restrictions for plugin execution.
 */
export const PLUGIN_SANDBOX = {
  max_memory_mb: 256,
  max_cpu_time_ms: 5000,
  max_network_requests: 10,
  allowed_apis: ['acoustic.features', 'incident', 'environment'],
  prohibited: [
    'raw_audio_access',
    'filesystem_write',
    'network_without_permission',
    'speech_recognition_api',
    'identity_system_access',
  ],
} as const

/**
 * Validate a plugin manifest before installation.
 */
export function validateManifest(manifest: PluginManifest): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!manifest.name || manifest.name.length < 2) errors.push('Name is required (min 2 chars)')
  if (!manifest.version) errors.push('Version is required')
  if (!manifest.class) errors.push('Plugin class is required')
  if (!manifest.entry) errors.push('Entry point is required')

  // Check for prohibited capabilities
  for (const cap of manifest.capabilities) {
    if (cap === 'network.outbound' && !manifest.network.allowed) {
      errors.push('Plugin requests network.outbound but network.allowed is false')
    }
  }

  // Signed plugins required in production
  if (!manifest.signature) {
    errors.push('Plugin signature is required for production environments')
  }

  return { valid: errors.length === 0, errors }
}
