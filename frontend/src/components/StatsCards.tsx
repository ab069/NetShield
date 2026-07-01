import { useEffect } from 'react'
import { useNetStore } from '../store/netStore'

const ORANGE = '#f97316'

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: '20px 24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  borderLeft: `4px solid ${ORANGE}`,
  flex: 1,
  minWidth: 200,
}

const labelStyle: React.CSSProperties = { fontSize: 13, color: '#6b7280', marginBottom: 8 }
const valueStyle: React.CSSProperties = { fontSize: 28, fontWeight: 700, color: '#111827' }

export default function StatsCards() {
  const stats = useNetStore((s) => s.stats)
  const trafficStats = useNetStore((s) => s.trafficStats)
  const fetchStats = useNetStore((s) => s.fetchStats)
  const fetchTrafficStats = useNetStore((s) => s.fetchTrafficStats)

  useEffect(() => {
    fetchStats()
    fetchTrafficStats()
  }, [fetchStats, fetchTrafficStats])

  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
      <div style={cardStyle}>
        <div style={labelStyle}>Total Alerts</div>
        <div style={{ ...valueStyle, color: ORANGE }}>{stats?.total ?? 0}</div>
      </div>
      <div style={{ ...cardStyle, borderLeftColor: '#dc2626' }}>
        <div style={labelStyle}>Critical Threats</div>
        <div style={{ ...valueStyle, color: '#dc2626' }}>{stats?.critical ?? 0}</div>
      </div>
      <div style={{ ...cardStyle, borderLeftColor: '#f59e0b' }}>
        <div style={labelStyle}>Suspicious Flows</div>
        <div style={{ ...valueStyle, color: '#f59e0b' }}>{trafficStats?.suspicious_count ?? 0}</div>
      </div>
    </div>
  )
}
