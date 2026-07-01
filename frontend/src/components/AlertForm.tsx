import { useState } from 'react'
import { useWebSocket } from '../hooks/useWebSocket'
import { useNetStore } from '../store/netStore'

const ORANGE = '#f97316'

const boxStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: 24,
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  marginBottom: 24,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  fontSize: 14,
  boxSizing: 'border-box',
}

const btnStyle: React.CSSProperties = {
  background: ORANGE,
  color: '#fff',
  border: 'none',
  padding: '10px 24px',
  borderRadius: 8,
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: 14,
}

const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, marginBottom: 12 }

export default function AlertForm() {
  const { send } = useWebSocket()
  const fetchAlerts = useNetStore((s) => s.fetchAlerts)
  const [form, setForm] = useState({
    src_ip: '', dst_ip: '', protocol: 'TCP', port: 80, bytes: 1000, duration: 1.0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    send({ action: 'analyze', packet: form })
    setTimeout(() => fetchAlerts(), 500)
  }

  const handleSimulate = () => {
    send({ action: 'simulate' })
    setTimeout(() => fetchAlerts(), 3000)
  }

  return (
    <div style={boxStyle}>
      <h3 style={{ margin: '0 0 16px', color: '#111827' }}>Network Event Analyzer</h3>
      <form onSubmit={handleSubmit}>
        <div style={rowStyle}>
          <input style={inputStyle} placeholder="Source IP" value={form.src_ip} onChange={(e) => setForm({ ...form, src_ip: e.target.value })} />
          <input style={inputStyle} placeholder="Dest IP" value={form.dst_ip} onChange={(e) => setForm({ ...form, dst_ip: e.target.value })} />
        </div>
        <div style={rowStyle}>
          <select style={inputStyle} value={form.protocol} onChange={(e) => setForm({ ...form, protocol: e.target.value })}>
            <option>TCP</option><option>UDP</option><option>ICMP</option><option>DNS</option><option>ARP</option>
          </select>
          <input style={inputStyle} type="number" placeholder="Port" value={form.port} onChange={(e) => setForm({ ...form, port: +e.target.value })} />
          <input style={inputStyle} type="number" placeholder="Bytes" value={form.bytes} onChange={(e) => setForm({ ...form, bytes: +e.target.value })} />
          <input style={inputStyle} type="number" step="0.1" placeholder="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: +e.target.value })} />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={btnStyle} type="submit">Analyze</button>
          <button style={{ ...btnStyle, background: '#4b5563' }} type="button" onClick={handleSimulate}>Simulate Traffic</button>
        </div>
      </form>
    </div>
  )
}
