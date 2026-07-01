import { useWsStore } from '../store/wsStore'

const boxStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: 24,
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  marginBottom: 24,
  maxHeight: 500,
  overflowY: 'auto',
}

export default function TrafficFeed() {
  const traffic = useWsStore((s) => s.traffic)

  return (
    <div style={boxStyle}>
      <h3 style={{ margin: '0 0 16px', color: '#111827' }}>Real-Time Traffic Feed</h3>
      {traffic.length === 0 && <p style={{ color: '#9ca3af' }}>No traffic yet. Simulate or analyze a packet.</p>}
      {traffic.slice(0, 30).map((t, i) => (
        <div
          key={i}
          style={{
            padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: 13, fontFamily: 'monospace', color: '#374151',
          }}
        >
          <span style={{ color: '#f97316', fontWeight: 600 }}>{t.protocol}</span>{' '}
          {t.src_ip} → {t.dst_ip}:{t.port}{' '}
          <span style={{ color: '#6b7280' }}>{t.bytes} bytes</span>{' '}
          <span style={{ color: '#9ca3af', fontSize: 11 }}>{new Date(t.timestamp).toLocaleTimeString()}</span>
        </div>
      ))}
    </div>
  )
}
