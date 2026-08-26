/**
 * State Machine Definitions
 *
 * Replace loosely managed booleans with explicit state transitions.
 * Every state change is validated before execution.
 */

// ─── Node Lifecycle ──────────────────────────────────────────────────────────

export type NodeState = 'provisioning' | 'commissioning' | 'operational' | 'degraded' | 'maintenance' | 'suspended' | 'retired'

export const NODE_TRANSITIONS: Record<NodeState, NodeState[]> = {
  provisioning: ['commissioning', 'retired'],
  commissioning: ['operational', 'provisioning'],
  operational: ['degraded', 'maintenance', 'suspended'],
  degraded: ['operational', 'maintenance', 'suspended'],
  maintenance: ['commissioning', 'operational', 'retired'],
  suspended: ['commissioning', 'retired'],
  retired: [],
}

// ─── Incident Lifecycle ──────────────────────────────────────────────────────

export type IncidentState = 'candidate' | 'active' | 'reviewing' | 'confirmed' | 'false_positive' | 'inconclusive' | 'closed'

export const INCIDENT_TRANSITIONS: Record<IncidentState, IncidentState[]> = {
  candidate: ['active', 'closed'],
  active: ['reviewing', 'closed'],
  reviewing: ['confirmed', 'false_positive', 'inconclusive'],
  confirmed: ['closed'],
  false_positive: ['closed'],
  inconclusive: ['reviewing', 'closed'],
  closed: [],
}

// ─── Model Lifecycle ─────────────────────────────────────────────────────────

export type ModelState = 'development' | 'evaluation' | 'shadow' | 'pilot' | 'production' | 'deprecated'

export const MODEL_TRANSITIONS: Record<ModelState, ModelState[]> = {
  development: ['evaluation'],
  evaluation: ['shadow', 'development'],
  shadow: ['pilot', 'evaluation'],
  pilot: ['production', 'shadow'],
  production: ['deprecated'],
  deprecated: [],
}

// ─── Deployment Lifecycle ────────────────────────────────────────────────────

export type DeploymentState = 'planning' | 'provisioning' | 'commissioning' | 'active' | 'degraded' | 'maintenance' | 'decommissioned'

export const DEPLOYMENT_TRANSITIONS: Record<DeploymentState, DeploymentState[]> = {
  planning: ['provisioning'],
  provisioning: ['commissioning', 'planning'],
  commissioning: ['active', 'provisioning'],
  active: ['degraded', 'maintenance', 'decommissioned'],
  degraded: ['active', 'maintenance'],
  maintenance: ['commissioning', 'active', 'decommissioned'],
  decommissioned: [],
}

/**
 * Validate a state transition. Throws if invalid.
 */
export function validateTransition<S extends string>(
  current: S,
  next: S,
  transitions: Record<S, S[]>,
  resource: string,
): void {
  const allowed = transitions[current]
  if (!allowed || !allowed.includes(next)) {
    throw new Error(
      `Invalid ${resource} state transition: ${current} → ${next}. ` +
      `Allowed from '${current}': [${(allowed ?? []).join(', ')}]`
    )
  }
}
