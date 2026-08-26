import { WS_URL } from './client'

export interface LiveIncidentEvent {
  type: 'incident_created' | 'incident_updated' | 'incident_confirmed' | 'incident_rejected'
  incident_id: string
  timestamp: string
  primary_class: string | null
  confidence_level: string | null
  overall_confidence: number | null
  status: string
}

export interface LiveSensorEvent {
  type: 'sensor_health_changed' | 'sensor_offline' | 'sensor_online'
  sensor_id: string
  timestamp: string
  status: string
  health_score: number | null
}

export type LiveEvent = LiveIncidentEvent | LiveSensorEvent

type EventHandler = (event: LiveEvent) => void
type StatusHandler = (connected: boolean) => void
type ErrorHandler = (err: Event) => void

const MIN_RECONNECT_DELAY = 1_000
const MAX_RECONNECT_DELAY = 30_000
const RECONNECT_MULTIPLIER = 1.5

export class ResonanceWebSocket {
  private ws: WebSocket | null = null
  private reconnectDelay = MIN_RECONNECT_DELAY
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private stopped = false

  private onEvent: EventHandler[] = []
  private onStatus: StatusHandler[] = []
  private onErr: ErrorHandler[] = []

  constructor(private readonly path = '/v1/incidents') {}

  connect() {
    this.stopped = false
    this.open()
  }

  private open() {
    const url = `${WS_URL}${this.path}`
    this.ws = new WebSocket(url)

    this.ws.onopen = () => {
      this.reconnectDelay = MIN_RECONNECT_DELAY
      this.ws!.send(
        JSON.stringify({ type: 'subscribe', topics: ['incidents', 'sensors'] }),
      )
      this.onStatus.forEach((h) => h(true))
    }

    this.ws.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data) as LiveEvent
        this.onEvent.forEach((h) => h(event))
      } catch {
        // Ignore malformed frames
      }
    }

    this.ws.onerror = (e) => {
      this.onErr.forEach((h) => h(e))
    }

    this.ws.onclose = () => {
      this.onStatus.forEach((h) => h(false))
      if (!this.stopped) {
        this.scheduleReconnect()
      }
    }
  }

  private scheduleReconnect() {
    this.reconnectTimer = setTimeout(() => {
      this.reconnectDelay = Math.min(
        this.reconnectDelay * RECONNECT_MULTIPLIER,
        MAX_RECONNECT_DELAY,
      )
      this.open()
    }, this.reconnectDelay)
  }

  addEventHandler(h: EventHandler) {
    this.onEvent.push(h)
    return () => { this.onEvent = this.onEvent.filter((x) => x !== h) }
  }

  addStatusHandler(h: StatusHandler) {
    this.onStatus.push(h)
    return () => { this.onStatus = this.onStatus.filter((x) => x !== h) }
  }

  addErrorHandler(h: ErrorHandler) {
    this.onErr.push(h)
    return () => { this.onErr = this.onErr.filter((x) => x !== h) }
  }

  disconnect() {
    this.stopped = true
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.ws?.close()
    this.ws = null
  }

  get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED
  }
}

// Singleton instance
let instance: ResonanceWebSocket | null = null

export function getWebSocket(): ResonanceWebSocket {
  if (!instance) {
    instance = new ResonanceWebSocket()
  }
  return instance
}
