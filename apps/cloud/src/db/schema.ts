import { z } from 'zod'

// ─── Organizations ───────────────────────────────────────────────────────────

export const organizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50),
  plan: z.enum(['community', 'professional', 'infrastructure', 'enterprise']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})
export type Organization = z.infer<typeof organizationSchema>

// ─── Workspaces ──────────────────────────────────────────────────────────────

export const workspaceSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50),
  deployment_profile: z.enum(['research', 'municipal', 'campus', 'industrial', 'infrastructure', 'private']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})
export type Workspace = z.infer<typeof workspaceSchema>

// ─── Users ───────────────────────────────────────────────────────────────────

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password_hash: z.string().optional(),
  auth_provider: z.enum(['email', 'google', 'github', 'oidc']).default('email'),
  mfa_enabled: z.boolean().default(false),
  created_at: z.string().datetime(),
  last_login: z.string().datetime().optional(),
})
export type User = z.infer<typeof userSchema>

// ─── Membership ──────────────────────────────────────────────────────────────

export const membershipSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  organization_id: z.string().uuid(),
  workspace_id: z.string().uuid().optional(),
  role: z.enum(['owner', 'administrator', 'engineer', 'operator', 'reviewer', 'technician', 'researcher', 'viewer']),
  created_at: z.string().datetime(),
})
export type Membership = z.infer<typeof membershipSchema>

// ─── API Keys ────────────────────────────────────────────────────────────────

export const apiKeySchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  workspace_id: z.string().uuid().optional(),
  name: z.string().min(1).max(100),
  key_prefix: z.string().length(8),
  key_hash: z.string(),
  scopes: z.array(z.string()),
  expires_at: z.string().datetime().optional(),
  last_used_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  revoked: z.boolean().default(false),
})
export type ApiKey = z.infer<typeof apiKeySchema>

// ─── Webhooks ────────────────────────────────────────────────────────────────

export const webhookSchema = z.object({
  id: z.string().uuid(),
  workspace_id: z.string().uuid(),
  url: z.string().url(),
  events: z.array(z.string()),
  secret: z.string(),
  active: z.boolean().default(true),
  created_at: z.string().datetime(),
  last_triggered_at: z.string().datetime().optional(),
  failure_count: z.number().default(0),
})
export type Webhook = z.infer<typeof webhookSchema>

// ─── Entitlements ────────────────────────────────────────────────────────────

export const entitlementSchema = z.object({
  organization_id: z.string().uuid(),
  feature: z.string(),
  limit: z.number().nullable(),
  enabled: z.boolean().default(true),
})
export type Entitlement = z.infer<typeof entitlementSchema>

export const PLAN_ENTITLEMENTS: Record<string, Record<string, number | null>> = {
  community: {
    'fleet.max_nodes': 4,
    'retention.days': 30,
    'models.shadow': 0,
    'evidence.exports': 10,
    'api.rate_limit': 100,
    'team.max_members': 3,
  },
  professional: {
    'fleet.max_nodes': 50,
    'retention.days': 90,
    'models.shadow': 2,
    'evidence.exports': 100,
    'api.rate_limit': 1000,
    'team.max_members': 15,
  },
  infrastructure: {
    'fleet.max_nodes': 500,
    'retention.days': 365,
    'models.shadow': 10,
    'evidence.exports': null, // unlimited
    'api.rate_limit': 10000,
    'team.max_members': 50,
  },
  enterprise: {
    'fleet.max_nodes': null,
    'retention.days': null,
    'models.shadow': null,
    'evidence.exports': null,
    'api.rate_limit': null,
    'team.max_members': null,
  },
}
