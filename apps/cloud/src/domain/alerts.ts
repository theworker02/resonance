/**
 * Alerting Engine
 *
 * Evaluates alert policies against incoming events.
 * Routes matched alerts to configured destinations.
 */

export interface AlertPolicy {
  id: string
  workspace_id: string
  name: string
  enabled: boolean
  conditions: AlertCondition[]
  destinations: AlertDestination[]
  cooldown_seconds: number
  last_triggered?: string
}

export interface AlertCondition {
  field: string
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains'
  value: string | number | boolean
}

export type AlertDestination =
  | { type: 'email'; address: string }
  | { type: 'webhook'; url: string }
  | { type: 'slack'; channel: string; webhook_url: string }
  | { type: 'teams'; webhook_url: string }

export interface Alert {
  id: string
  policy_id: string
  workspace_id: string
  severity: 'info' | 'warning' | 'critical'
  title: string
  description: string
  triggered_at: string
  acknowledged: boolean
  acknowledged_by?: string
  resolved: boolean
  resolved_at?: string
}

export function evaluateConditions(
  conditions: AlertCondition[],
  data: Record<string, unknown>,
): boolean {
  return conditions.every(cond => {
    const value = data[cond.field]
    switch (cond.operator) {
      case 'eq': return value === cond.value
      case 'neq': return value !== cond.value
      case 'gt': return typeof value === 'number' && value > (cond.value as number)
      case 'gte': return typeof value === 'number' && value >= (cond.value as number)
      case 'lt': return typeof value === 'number' && value < (cond.value as number)
      case 'lte': return typeof value === 'number' && value <= (cond.value as number)
      case 'contains': return typeof value === 'string' && value.includes(cond.value as string)
      default: return false
    }
  })
}
