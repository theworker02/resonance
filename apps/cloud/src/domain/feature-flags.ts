/**
 * Feature Flag System (Item 106-107)
 *
 * Centralized feature toggling. No scattered env var checks.
 * Supports: boolean, percentage rollout, user/org targeting.
 */

export type FlagValue = boolean | number | string

export interface FeatureFlag {
  key: string
  description: string
  default_value: FlagValue
  enabled: boolean
  rollout_percentage?: number
  target_organizations?: string[]
  target_workspaces?: string[]
  created_at: string
  updated_at: string
}

export const FLAGS: Record<string, FeatureFlag> = {
  evidence_graph_v2: {
    key: 'evidence_graph_v2',
    description: 'New evidence graph visualization with interactive exploration',
    default_value: false,
    enabled: false,
    rollout_percentage: 0,
    created_at: '2026-08-25T00:00:00Z',
    updated_at: '2026-08-25T00:00:00Z',
  },
  new_model_console: {
    key: 'new_model_console',
    description: 'Redesigned model management interface with shadow comparison',
    default_value: false,
    enabled: false,
    rollout_percentage: 0,
    created_at: '2026-08-25T00:00:00Z',
    updated_at: '2026-08-25T00:00:00Z',
  },
  experimental_mesh: {
    key: 'experimental_mesh',
    description: 'Experimental mesh topology auto-optimization',
    default_value: false,
    enabled: false,
    target_organizations: [],
    created_at: '2026-08-25T00:00:00Z',
    updated_at: '2026-08-25T00:00:00Z',
  },
  aps_v2_surface: {
    key: 'aps_v2_surface',
    description: 'Acoustic Probability Surface v2 with continuous interpolation',
    default_value: false,
    enabled: true,
    rollout_percentage: 25,
    created_at: '2026-08-25T00:00:00Z',
    updated_at: '2026-08-25T00:00:00Z',
  },
  plugin_system: {
    key: 'plugin_system',
    description: 'Third-party plugin installation and management',
    default_value: false,
    enabled: false,
    rollout_percentage: 0,
    created_at: '2026-08-25T00:00:00Z',
    updated_at: '2026-08-25T00:00:00Z',
  },
}

/**
 * Evaluate whether a flag is active for a given context.
 */
export function isEnabled(
  flagKey: string,
  context?: { organization_id?: string; workspace_id?: string; user_id?: string },
): boolean {
  const flag = FLAGS[flagKey]
  if (!flag || !flag.enabled) return false

  // Organization targeting
  if (flag.target_organizations?.length && context?.organization_id) {
    if (flag.target_organizations.includes(context.organization_id)) return true
  }

  // Workspace targeting
  if (flag.target_workspaces?.length && context?.workspace_id) {
    if (flag.target_workspaces.includes(context.workspace_id)) return true
  }

  // Percentage rollout (deterministic based on user/org ID)
  if (flag.rollout_percentage !== undefined && flag.rollout_percentage > 0) {
    const seed = context?.user_id ?? context?.organization_id ?? ''
    const hash = simpleHash(seed + flagKey)
    return (hash % 100) < flag.rollout_percentage
  }

  return flag.default_value === true
}

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}
