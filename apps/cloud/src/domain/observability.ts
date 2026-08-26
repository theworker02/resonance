/**
 * Observability — metrics, traces, logs, health, readiness.
 *
 * Every production service exposes these. No exceptions.
 */

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  version: string
  uptime_seconds: number
  checks: HealthCheck[]
}

export interface HealthCheck {
  name: string
  status: 'pass' | 'fail' | 'warn'
  latency_ms?: number
  message?: string
}

export interface MetricPoint {
  name: string
  value: number
  labels: Record<string, string>
  timestamp: string
}

export interface SLO {
  name: string
  target: number
  window: string
  current: number
  budget_remaining: number
  status: 'met' | 'at_risk' | 'breached'
}

export const SERVICE_SLOS: SLO[] = [
  { name: 'API Availability', target: 0.999, window: '30d', current: 0.9995, budget_remaining: 0.85, status: 'met' },
  { name: 'Observation Ingestion P99', target: 0.95, window: '7d', current: 0.97, budget_remaining: 0.90, status: 'met' },
  { name: 'Incident Processing P95', target: 0.90, window: '7d', current: 0.92, budget_remaining: 0.75, status: 'met' },
  { name: 'Webhook Delivery', target: 0.99, window: '30d', current: 0.991, budget_remaining: 0.60, status: 'met' },
]

export const PERFORMANCE_BUDGET = {
  'api.response_p50_ms': 50,
  'api.response_p95_ms': 200,
  'api.response_p99_ms': 500,
  'observation.ingestion_ms': 100,
  'incident.processing_ms': 2000,
  'model.inference_ms': 50,
  'frontend.initial_load_kb': 250,
  'frontend.route_transition_ms': 200,
  'frontend.large_table_render_ms': 100,
} as const
