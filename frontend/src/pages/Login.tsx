import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const ORANGE = '#f97316'

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f9fafb',
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  padding: 40,
  width: 400,
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  fontSize: 14,
  marginBottom: 16,
  boxSizing: 'border-box',
}

const btnStyle: React.CSSProperties = {
  width: '100%',
  background: ORANGE,
  color: '#fff',
  border: 'none',
  padding: '12px',
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer',
}

export default function Login() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch {
      setError('Invalid credentials')
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🛡️</div>
          <h1 style={{ margin: 0, color: '#111827' }}>NetShield</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Network Security Monitoring</p>
        </div>
        {error && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={inputStyle} placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input style={inputStyle} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button style={btnStyle} type="submit">Sign In</button>
        </form>
        <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 16 }}>
          No account? <Link to="/register" style={{ color: ORANGE }}>Register</Link>
        </p>
      </div>
    </div>
  )
}
