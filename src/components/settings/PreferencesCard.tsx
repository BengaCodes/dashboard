import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Button from '../common/Button'
import { usePreferences } from '../../state/PreferencesContext'
import useMutationQuery from '../../hooks/api/useMutationQuery'
import { preferencesApi } from '../../api/preferences.api'
import type { Preferences } from '../../types'
import { card, sectionLabel, fieldLabel, inputStyle, focusIn, focusOut } from './settingsShared'
import SettingsToggle from './SettingsToggle'

const PREFS_KEY = ['preferences'] as const

function diffPreferences(original: Preferences, current: Preferences): Partial<Preferences> {
  const patch: Partial<Preferences> = {}
  for (const key in current) {
    const k = key as keyof Preferences
    if (current[k] !== original[k]) (patch as Record<string, unknown>)[k] = current[k]
  }
  return patch
}

const PrefSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          height: '38px',
          borderRadius: '6px',
          background: '#1A2035',
          animation: 'prefPulse 1.5s ease-in-out infinite',
          animationDelay: `${i * 120}ms`,
        }}
      />
    ))}
  </div>
)

const PreferencesCard = () => {
  const { setPreferences } = usePreferences()
  const queryClient = useQueryClient()

  const { data: saved, isLoading, refetch } = useQuery<Preferences>({
    queryKey: PREFS_KEY,
    queryFn:  preferencesApi.get,
    retry:    false,
  })

  const [currency,             setCurrency]            = useState('GBP')
  const [monthStartDay,        setMonthStartDay]       = useState(1)
  const [notifyBudgetAlerts,   setNotifyBudgetAlerts]  = useState(true)
  const [notifyMonthlySummary, setNotifyMonthlySummary]= useState(true)

  useEffect(() => {
    if (!saved) return
    setCurrency(saved.currency)
    setMonthStartDay(saved.month_start_day)
    setNotifyBudgetAlerts(saved.notify_budget_alerts)
    setNotifyMonthlySummary(saved.notify_monthly_summary)
  }, [saved])

  const { mutation: patchMutation } = useMutationQuery({
    mutationFn: preferencesApi.patch,
    options: {
      onSuccess: (updated) => {
        queryClient.setQueryData(PREFS_KEY, updated)
        setPreferences(updated)
      },
    },
  })

  const handleSave = () => {
    if (!saved) return
    const current: Preferences = {
      ...saved,
      currency,
      month_start_day:        monthStartDay,
      notify_budget_alerts:   notifyBudgetAlerts,
      notify_monthly_summary: notifyMonthlySummary,
    }
    const changes = diffPreferences(saved, current)
    if (!Object.keys(changes).length) return
    patchMutation.mutate(changes)
  }

  const resetBtnDisabled = isLoading || patchMutation.isPending

  return (
    <div style={card}>
      <p style={sectionLabel}>Preferences</p>

      {isLoading ? <PrefSkeleton /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <p style={fieldLabel}>Currency</p>
            <select
              style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              onFocus={focusIn} onBlur={focusOut}
            >
              <option value='GBP'>GBP — British Pound (£)</option>
              <option value='USD'>USD — US Dollar ($)</option>
              <option value='EUR'>EUR — Euro (€)</option>
            </select>
          </div>

          <div>
            <p style={fieldLabel}>Month starts on day</p>
            <input
              type='number'
              min={1} max={28}
              style={inputStyle}
              value={monthStartDay}
              onChange={(e) => setMonthStartDay(Number(e.target.value))}
              onFocus={focusIn} onBlur={focusOut}
            />
          </div>

          {([
            { label: 'Budget alerts',   value: notifyBudgetAlerts,   set: setNotifyBudgetAlerts   },
            { label: 'Monthly summary', value: notifyMonthlySummary, set: setNotifyMonthlySummary },
          ] as const).map(({ label, value, set }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-text-primary)' }}>
                {label}
              </span>
              <SettingsToggle checked={value} onChange={() => set(!value)} />
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <Button
          variant='primary'
          onClick={handleSave}
          disabled={isLoading || patchMutation.isPending}
        >
          {patchMutation.isPending ? 'Saving…' : 'Save changes'}
        </Button>
        <button
          onClick={() => refetch()}
          disabled={resetBtnDisabled}
          style={{
            padding: '8px 16px', borderRadius: '8px',
            border: '0.5px solid rgba(255,255,255,0.08)', background: 'transparent',
            color: 'var(--color-text-muted)', fontFamily: 'var(--font-ui)', fontSize: '13px',
            cursor: resetBtnDisabled ? 'not-allowed' : 'pointer',
            transition: 'color 150ms ease, border-color 150ms ease',
          }}
          onMouseEnter={(e) => {
            if (!resetBtnDisabled) { e.currentTarget.style.color = 'var(--color-text-primary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default PreferencesCard
