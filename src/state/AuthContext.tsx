import { useEffect, useState, type ReactNode } from 'react'
import type { AuthUser } from '../utils/auth.type'
import supabase from '../utils/supabase'
import { AuthContext } from './useAuth'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (session?.user) {
        setUser({
          id: session.user.id ?? '',
          email: session.user.email ?? ''
        })
        setLoading(false)
      }
    }

    initializeAuth()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id ?? '',
          email: session.user.email ?? ''
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) throw error
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) throw error
  }

  const value = {
    user,
    signIn,
    signOut,
    signUp,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
