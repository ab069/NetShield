import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  username: string
  email: string
  is_active: boolean
}

interface AuthState {
  token: string | null
  user: User | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const API = '/api'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: async (username, password) => {
        const params = new URLSearchParams({ username, password })
        const res = await fetch(`${API}/auth/login?${params}`, { method: 'POST' })
        if (!res.ok) throw new Error('Login failed')
        const data = await res.json()
        set({ token: data.access_token, user: data.user })
      },
      register: async (username, email, password) => {
        const res = await fetch(`${API}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        })
        if (!res.ok) throw new Error('Registration failed')
        const data = await res.json()
        set({ token: data.access_token, user: data.user })
      },
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'netshield-auth' }
  )
)
