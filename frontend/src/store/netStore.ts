import { create } from 'zustand'
import { useAuthStore } from './authStore'

interface Alert {
  id: number
  title: string
  description: string | null
  alert_type: string
  source_ip: string
  dest_ip: string
  protocol: string
  severity: string
  status: string
  details: Record<string, unknown> | null
  created_at: string
}

interface Traffic {
  id: number
  src_ip: string
  dst_ip: string
  protocol: string
  port: number
  bytes_sent: number
  bytes_received: number
  duration: number
  is_suspicious: boolean
  threat_score: number
  created_at: string
}

interface Stats {
  total: number
  critical: number
  open: number
  resolved: number
}

interface TrafficStatsData {
  total_flows: number
  total_bytes_sent: number
  total_bytes_received: number
  suspicious_count: number
  average_threat_score: number
}

interface NetState {
  alerts: Alert[]
  traffic: Traffic[]
  stats: Stats | null
  trafficStats: TrafficStatsData | null
  loading: boolean
  fetchAlerts: () => Promise<void>
  fetchTraffic: () => Promise<void>
  fetchStats: () => Promise<void>
  fetchTrafficStats: () => Promise<void>
  submitAlert: (data: {
    title: string
    alert_type: string
    source_ip: string
    dest_ip: string
    protocol: string
    severity?: string
    description?: string
  }) => Promise<void>
}

function authHeaders(): Record<string, string> {
  const token = useAuthStore.getState().token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const API = '/api'

export const useNetStore = create<NetState>((set) => ({
  alerts: [],
  traffic: [],
  stats: null,
  trafficStats: null,
  loading: false,
  fetchAlerts: async () => {
    const res = await fetch(`${API}/alerts/`, { headers: authHeaders() })
    if (res.ok) set({ alerts: await res.json() })
  },
  fetchTraffic: async () => {
    const res = await fetch(`${API}/traffic/`, { headers: authHeaders() })
    if (res.ok) set({ traffic: await res.json() })
  },
  fetchStats: async () => {
    const res = await fetch(`${API}/alerts/stats`, { headers: authHeaders() })
    if (res.ok) set({ stats: await res.json() })
  },
  fetchTrafficStats: async () => {
    const res = await fetch(`${API}/traffic/stats`, { headers: authHeaders() })
    if (res.ok) set({ trafficStats: await res.json() })
  },
  submitAlert: async (data) => {
    set({ loading: true })
    try {
      await fetch(`${API}/alerts/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
      })
    } finally {
      set({ loading: false })
    }
  },
}))
