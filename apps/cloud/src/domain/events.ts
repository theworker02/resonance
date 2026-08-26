/**
 * Resonance Domain Events
 *
 * All significant state changes publish events. Consumers subscribe
 * without coupling to producers. Enables: real-time UI, audit, webhooks,
 * async processing, and deterministic replay.
 */

export type DomainEvent =
  | { type: 'node.registered'; payload: { node_id: string; family: string; workspace_id: string } }
  | { type: 'node.health_changed'; payload: { node_id: string; score: number; previous: number } }
  | { type: 'node.offline'; payload: { node_id: string; last_seen: string } }
  | { type: 'observation.received'; payload: { observation_id: string; node_id: string; incident_id?: string } }
  | { type: 'observation.correlated'; payload: { observation_id: string; incident_id: string } }
  | { type: 'incident.created'; payload: { incident_id: string; confidence: number; classification: string } }
  | { type: 'incident.reviewed'; payload: { incident_id: string; disposition: string; reviewer: string } }
  | { type: 'incident.closed'; payload: { incident_id: string; resolution: string } }
  | { type: 'model.promoted'; payload: { model_id: string; from_stage: string; to_stage: string } }
  | { type: 'model.deprecated'; payload: { model_id: string } }
  | { type: 'deployment.created'; payload: { deployment_id: string; workspace_id: string } }
  | { type: 'deployment.degraded'; payload: { deployment_id: string; reason: string } }
  | { type: 'config.changed'; payload: { resource_type: string; resource_id: string; author: string; version: number } }
  | { type: 'alert.triggered'; payload: { alert_id: string; policy_id: string; severity: string } }
  | { type: 'webhook.delivered'; payload: { webhook_id: string; event_type: string; status: number } }

export interface EventMetadata {
  id: string
  timestamp: string
  organization_id: string
  workspace_id?: string
  actor?: string
  correlation_id?: string
}

export interface PublishedEvent {
  event: DomainEvent
  metadata: EventMetadata
}

type EventHandler = (event: PublishedEvent) => Promise<void>

/**
 * In-process event bus. In production, backed by NATS JetStream.
 */
export class EventBus {
  private handlers = new Map<string, EventHandler[]>()

  on(eventType: string, handler: EventHandler): () => void {
    const list = this.handlers.get(eventType) ?? []
    list.push(handler)
    this.handlers.set(eventType, list)
    return () => {
      const idx = list.indexOf(handler)
      if (idx >= 0) list.splice(idx, 1)
    }
  }

  async publish(event: DomainEvent, metadata: EventMetadata): Promise<void> {
    const published: PublishedEvent = { event, metadata }
    const handlers = this.handlers.get(event.type) ?? []
    const wildcardHandlers = this.handlers.get('*') ?? []

    await Promise.allSettled([
      ...handlers.map(h => h(published)),
      ...wildcardHandlers.map(h => h(published)),
    ])
  }
}

export const eventBus = new EventBus()
