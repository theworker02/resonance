/**
 * Audit System — append-only event log for compliance and forensics.
 *
 * Every significant action produces an audit entry.
 * Entries are immutable once written.
 */

export interface AuditEntry {
  id: string
  timestamp: string
  organization_id: string
  workspace_id?: string
  actor: string
  actor_type: 'user' | 'system' | 'api_key' | 'webhook'
  action: string
  resource_type: string
  resource_id: string
  details: Record<string, unknown>
  ip_address?: string
  user_agent?: string
  correlation_id?: string
}

export const AUDITABLE_ACTIONS = [
  'auth.login',
  'auth.logout',
  'auth.signup',
  'config.changed',
  'model.promoted',
  'model.deprecated',
  'firmware.updated',
  'incident.reviewed',
  'incident.exported',
  'permission.changed',
  'apikey.created',
  'apikey.revoked',
  'webhook.created',
  'webhook.deleted',
  'node.enrolled',
  'node.retired',
  'deployment.created',
  'deployment.deleted',
  'member.invited',
  'member.removed',
  'member.role_changed',
] as const

export type AuditableAction = typeof AUDITABLE_ACTIONS[number]

export function createAuditEntry(
  action: AuditableAction,
  actor: string,
  resourceType: string,
  resourceId: string,
  orgId: string,
  details: Record<string, unknown> = {},
  workspaceId?: string,
): AuditEntry {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    organization_id: orgId,
    workspace_id: workspaceId,
    actor,
    actor_type: 'user',
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    details,
  }
}
