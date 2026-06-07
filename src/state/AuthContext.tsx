import { useState, type ReactNode, useCallback } from 'react'
import type { AuthContextType, AuthUser } from '../utils/auth.type'
import { authApi } from '../api/auth.api'
import { AuthContext } from './useAuth'

const TOKEN_KEY = 'fintraxx_token'
const USER_KEY = 'fintraxx_user'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  const signUp = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const { token, user } = await authApi.signUp(email, password)
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      setUser(user)
    } finally {
      setLoading(false)
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const { token, user } = await authApi.signIn(email, password)
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      setUser(user)
    } catch (err) {
      // Explicitly rethrow so form components can show the error message
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  const value: AuthContextType = { user, loading, signUp, signIn, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
