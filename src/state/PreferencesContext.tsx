import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Preferences } from '../types'

export const DEFAULT_PREFERENCES: Preferences = {
  display_name:           null,
  currency:               'GBP',
  month_start_day:        1,
  notify_budget_alerts:   true,
  notify_monthly_summary: true,
  dark_mode:              true,
}

type PreferencesContextType = {
  preferences: Preferences
  setPreferences: (prefs: Preferences) => void
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES)

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export const usePreferences = () => {
  const ctx = useContext(PreferencesContext)
  if (!ctx) throw new Error('usePreferences must be used within a PreferencesProvider')
  return ctx
}
