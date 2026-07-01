import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useNetStore } from '../store/netStore'
import { useEffect, useMemo } from 'react'

const ORANGE = '#f97316'

const boxStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: 24,
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  marginBottom: 24,
}

export default function TrafficChart() {
  const traffic = useNetStore((s) => s.traffic)
  const fetchTraffic = useNetStore((s) => s.fetchTraffic)

  useEffect(() => { fetchTraffic() }, [fetchTraffic])

  const data = useMemo(() => {
    const groups: Record<string, number> = {}
    traffic.forEach((t) => {
      groups[t.protocol] = (groups[t.protocol] || 0) + t.bytes_sent
    })
    return Object.entries(groups).map(([protocol, bytes]) => ({ protocol, bytes }))
  }, [traffic])

  return (
    <div style={boxStyle}>
      <h3 style={{ margin: '0 0 16px', color: '#111827' }}>Traffic by Protocol (bytes)</h3>
      {data.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>No traffic data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="protocol" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="bytes" fill={ORANGE} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
