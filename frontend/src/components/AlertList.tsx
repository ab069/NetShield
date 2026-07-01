import { useState, useEffect } from 'react'
import { useNetStore } from '../store/netStore'
import { useWsStore } from '../store/wsStore'

const severityColors: Record<string, string> = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#f97316',
  low: '#f59e0b',
}

const boxStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: 24,
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  marginBottom: 24,
  maxHeight: 500,
  overflowY: 'auto',
}

export default function AlertList() {
  const alerts = useNetStore((s) => s.alerts)
  const wsAlerts = useWsStore((s) => s.alerts)
  const fetchAlerts = useNetStore((s) => s.fetchAlerts)
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => { fetchAlerts() }, [fetchAlerts])

  const items = [
    ...wsAlerts.map((a, i) => ({ id: -(i + 1), title: a.title, description: a.description, alert_type: a.alert_type, severity: a.severity, source_ip: a.source_ip, dest_ip: a.dest_ip, protocol: a.protocol, status: 'open', created_at: a.timestamp, ws: true })),
    ...alerts,
  ].slice(0, 50)

  return (
    <div style={boxStyle}>
      <h3 style={{ margin: '0 0 16px', color: '#111827' }}>Recent Alerts</h3>
      {items.length === 0 && <p style={{ color: '#9ca3af' }}>No alerts yet.</p>}
      {items.map((a) => (
        <div
          key={a.id}
          style={{
            padding: '12px 0', borderBottom: '1px solid #f3f4f6', cursor: 'pointer',
          }}
          onClick={() => setExpanded(expanded === a.id ? null : a.id)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              background: severityColors[a.severity] || '#6b7280',
              color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>
              {a.severity}
            </span>
            <span style={{ fontWeight: 600, fontSize: 14, flex: 1, color: '#111827' }}>{a.title}</span>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>{new Date(a.created_at).toLocaleTimeString()}</span>
          </div>
          {expanded === a.id && (
            <div style={{ marginTop: 8, padding: 12, background: '#f9fafb', borderRadius: 8, fontSize: 13, color: '#374151' }}>
              <div><strong>Type:</strong> {a.alert_type}</div>
              <div><strong>Source:</strong> {a.source_ip} → <strong>Dest:</strong> {a.dest_ip}</div>
              <div><strong>Protocol:</strong> {a.protocol} | <strong>Status:</strong> {a.status}</div>
              {'description' in a && a.description && <div><strong>Description:</strong> {a.description}</div>}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
