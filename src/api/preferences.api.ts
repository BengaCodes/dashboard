import { api } from './client'
import type { Preferences } from '../types'

export const preferencesApi = {
  get:   ()                          => api.get<Preferences>('/preferences'),
  patch: (data: Partial<Preferences>) => api.patch<Preferences>('/preferences', data),
}
