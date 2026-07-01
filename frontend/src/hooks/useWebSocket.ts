import { useEffect, useRef } from 'react'
import { useWsStore } from '../store/wsStore'

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null)
  const setConnected = useWsStore((s) => s.setConnected)
  const pushAlert = useWsStore((s) => s.pushAlert)
  const pushTraffic = useWsStore((s) => s.pushTraffic)

  useEffect(() => {
    function connect() {
      const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
      const host = location.host
      const ws = new WebSocket(`${protocol}//${host}/ws`)
      wsRef.current = ws

      ws.onopen = () => setConnected(true)
      ws.onclose = () => {
        setConnected(false)
        setTimeout(connect, 3000)
      }
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          if (msg.type === 'alert') pushAlert(msg.data)
          else if (msg.type === 'traffic') pushTraffic(msg.data)
        } catch { /* ignore */ }
      }
    }

    connect()
    return () => {
      wsRef.current?.close()
    }
  }, [setConnected, pushAlert, pushTraffic])

  const send = (data: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    }
  }

  return { send }
}
