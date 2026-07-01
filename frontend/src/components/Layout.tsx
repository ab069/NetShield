import { useAuthStore } from '../store/authStore'

const ORANGE = '#f97316'

const styles: Record<string, React.CSSProperties> = {
  header: {
    background: `linear-gradient(135deg, ${ORANGE}, #ea580c)`,
    color: '#fff',
    padding: '0 24px',
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: { fontSize: 20, fontWeight: 700, letterSpacing: 1 },
  btn: { background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '6px 16px', borderRadius: 6, cursor: 'pointer' },
  main: { padding: 24, maxWidth: 1400, margin: '0 auto' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div>
      <header style={styles.header}>
        <div style={styles.logo}>🛡️ NetShield</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 14, opacity: 0.9 }}>{user?.username}</span>
          <button style={styles.btn} onClick={logout}>Logout</button>
        </div>
      </header>
      <main style={styles.main}>{children}</main>
    </div>
  )
}
