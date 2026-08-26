import { useEffect, useRef, useState, useCallback } from 'react'
import { getWebSocket, type LiveEvent } from '../api/websocket'

const MAX_EVENTS = 50

export interface UseLiveEventsResult {
  events: LiveEvent[]
  isConnected: boolean
  error: Event | null
  clearEvents: () => void
}

export function useLiveEvents(): UseLiveEventsResult {
  const [events, setEvents] = useState<LiveEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Event | null>(null)
  const wsRef = useRef(getWebSocket())

  const clearEvents = useCallback(() => setEvents([]), [])

  useEffect(() => {
    const ws = wsRef.current

    const removeEvent = ws.addEventHandler((event) => {
      setEvents((prev) => [event, ...prev].slice(0, MAX_EVENTS))
    })

    const removeStatus = ws.addStatusHandler((connected) => {
      setIsConnected(connected)
    })

    const removeError = ws.addErrorHandler((err) => {
      setError(err)
    })

    ws.connect()

    return () => {
      removeEvent()
      removeStatus()
      removeError()
      ws.disconnect()
    }
  }, [])

  return { events, isConnected, error, clearEvents }
}
