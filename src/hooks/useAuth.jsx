import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function resolve(next) {
      if (!next) {
        if (active) {
          setSession(null)
          setIsAdmin(false)
          setLoading(false)
        }
        return
      }
      if (active) setLoading(true)
      // La comprobación real de admin se hace en la base de datos (función is_admin).
      const { data, error } = await supabase.rpc('is_admin')
      if (!active) return
      setSession(next)
      setIsAdmin(!error && data === true)
      setLoading(false)
    }

    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      // setTimeout evita bloquear el cliente de Supabase dentro del callback.
      setTimeout(() => resolve(next), 0)
    })
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      isAdmin,
      loading,
      signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
      signOut: () => supabase.auth.signOut(),
    }),
    [session, isAdmin, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
