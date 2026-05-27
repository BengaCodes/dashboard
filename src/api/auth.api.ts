import { api } from './client'

export type AuthUser = { id: string; email: string }
export type AuthResponse = { token: string; user: AuthUser }

export const authApi = {
  signUp: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/sign-up', { email, password }),

  signIn: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/sign-in', { email, password }),
}
