/**
 * Resonance RBAC Permission Engine
 *
 * Permissions are structured as: resource.action
 * Authorization is checked against the user's role in the relevant workspace/org.
 */

export const PERMISSIONS = {
  // Incidents
  'incident.read': ['owner', 'administrator', 'engineer', 'operator', 'reviewer', 'researcher', 'viewer'],
  'incident.review': ['owner', 'administrator', 'operator', 'reviewer'],
  'incident.export': ['owner', 'administrator', 'engineer', 'operator', 'reviewer'],
  'incident.replay': ['owner', 'administrator', 'engineer', 'researcher'],

  // Nodes
  'node.read': ['owner', 'administrator', 'engineer', 'operator', 'technician', 'researcher', 'viewer'],
  'node.configure': ['owner', 'administrator', 'engineer'],
  'node.update': ['owner', 'administrator', 'engineer'],
  'node.enroll': ['owner', 'administrator', 'engineer', 'technician'],
  'node.retire': ['owner', 'administrator'],

  // Deployments
  'deployment.read': ['owner', 'administrator', 'engineer', 'operator', 'researcher', 'viewer'],
  'deployment.create': ['owner', 'administrator', 'engineer'],
  'deployment.modify': ['owner', 'administrator', 'engineer'],
  'deployment.delete': ['owner', 'administrator'],

  // Models
  'model.read': ['owner', 'administrator', 'engineer', 'researcher', 'viewer'],
  'model.deploy': ['owner', 'administrator', 'engineer'],
  'model.evaluate': ['owner', 'administrator', 'engineer', 'researcher'],
  'model.promote': ['owner', 'administrator'],

  // Fleet
  'fleet.read': ['owner', 'administrator', 'engineer', 'operator', 'technician', 'viewer'],
  'fleet.maintain': ['owner', 'administrator', 'engineer', 'technician'],
  'fleet.firmware': ['owner', 'administrator', 'engineer'],

  // Audit
  'audit.read': ['owner', 'administrator', 'engineer', 'operator', 'reviewer'],

  // Settings
  'settings.read': ['owner', 'administrator'],
  'settings.modify': ['owner', 'administrator'],

  // Billing
  'billing.read': ['owner', 'administrator'],
  'billing.manage': ['owner'],

  // API Keys
  'apikey.create': ['owner', 'administrator', 'engineer'],
  'apikey.revoke': ['owner', 'administrator'],

  // Webhooks
  'webhook.manage': ['owner', 'administrator', 'engineer'],

  // Members
  'member.read': ['owner', 'administrator'],
  'member.invite': ['owner', 'administrator'],
  'member.remove': ['owner', 'administrator'],
  'member.change_role': ['owner'],
} as const satisfies Record<string, readonly string[]>

export type Permission = keyof typeof PERMISSIONS
export type Role = 'owner' | 'administrator' | 'engineer' | 'operator' | 'reviewer' | 'technician' | 'researcher' | 'viewer'

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const allowed = PERMISSIONS[permission]
  return (allowed as readonly string[]).includes(role)
}

/**
 * Get all permissions for a given role.
 */
export function permissionsForRole(role: Role): Permission[] {
  return (Object.entries(PERMISSIONS) as [Permission, readonly string[]][])
    .filter(([_, roles]) => roles.includes(role))
    .map(([perm]) => perm)
}

/**
 * Authorization context — extracted from the authenticated request.
 */
export interface AuthContext {
  userId: string
  organizationId: string
  workspaceId?: string
  role: Role
}

/**
 * Enforce a permission check. Throws if unauthorized.
 */
export function authorize(ctx: AuthContext, permission: Permission): void {
  if (!hasPermission(ctx.role, permission)) {
    throw new AuthorizationError(
      `Role '${ctx.role}' does not have permission '${permission}'`,
      permission,
      ctx.role,
    )
  }
}

export class AuthorizationError extends Error {
  public readonly code = 'PERMISSION_DENIED'
  public readonly retriable = false

  constructor(
    message: string,
    public readonly permission: Permission,
    public readonly role: Role,
  ) {
    super(message)
    this.name = 'AuthorizationError'
  }
}
