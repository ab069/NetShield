import { create } from 'zustand'

interface AlertEventData {
  alert_type: string
  title: string
  description: string
  source_ip: string
  dest_ip: string
  protocol: string
  severity: string
  threat_score: number
  timestamp: string
}

interface TrafficEventData {
  src_ip: string
  dst_ip: string
  protocol: string
  port: number
  bytes: number
  timestamp: string
}

interface WsState {
  connected: boolean
  lastAlert: AlertEventData | null
  lastTraffic: TrafficEventData | null
  alerts: AlertEventData[]
  traffic: TrafficEventData[]
  setConnected: (v: boolean) => void
  pushAlert: (a: AlertEventData) => void
  pushTraffic: (t: TrafficEventData) => void
}

export const useWsStore = create<WsState>((set) => ({
  connected: false,
  lastAlert: null,
  lastTraffic: null,
  alerts: [],
  traffic: [],
  setConnected: (v) => set({ connected: v }),
  pushAlert: (a) =>
    set((s) => ({
      lastAlert: a,
      alerts: [a, ...s.alerts].slice(0, 100),
    })),
  pushTraffic: (t) =>
    set((s) => ({
      lastTraffic: t,
      traffic: [t, ...s.traffic].slice(0, 100),
    })),
}))
