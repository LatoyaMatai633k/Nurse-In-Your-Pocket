import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type LocalUser = { id: string; name: string; email: string }
type AuthContextValue = { user: LocalUser | null; loading: boolean; signIn: (details: Omit<LocalUser, 'id'>) => void; signOut: () => Promise<void> }
const SESSION_KEY = 'niyp.local-session'
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    try { const stored = localStorage.getItem(SESSION_KEY); if (stored) setUser(JSON.parse(stored) as LocalUser) }
    catch { localStorage.removeItem(SESSION_KEY) }
    finally { setLoading(false) }
  }, [])
  const value = useMemo<AuthContextValue>(() => ({
    user, loading,
    signIn: (details) => { const next = { ...details, id: details.email.toLowerCase() }; localStorage.setItem(SESSION_KEY, JSON.stringify(next)); setUser(next) },
    signOut: async () => { localStorage.removeItem(SESSION_KEY); setUser(null) },
  }), [loading, user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
