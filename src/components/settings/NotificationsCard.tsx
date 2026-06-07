import { useState } from 'react'
import { card, sectionLabel } from './settingsShared'
import SettingsToggle from './SettingsToggle'

const NotificationsCard = () => {
  const [states, setStates] = useState({
    budgetAlerts:    true,
    weeklyReport:    true,
    recurringRemind: false,
    securityAlerts:  true,
  })
  const toggle = (key: keyof typeof states) =>
    setStates((s) => ({ ...s, [key]: !s[key] }))

  const items: { key: keyof typeof states; label: string; desc: string }[] = [
    { key: 'budgetAlerts',    label: 'Budget alerts',       desc: 'Notify when a budget is over 80% spent'   },
    { key: 'weeklyReport',    label: 'Weekly digest',       desc: 'Summary of income and expenses each week'  },
    { key: 'recurringRemind', label: 'Recurring reminders', desc: 'Alert before recurring transactions post'  },
    { key: 'securityAlerts',  label: 'Security alerts',     desc: 'Sign-in from a new device or location'    },
  ]

  return (
    <div style={card}>
      <p style={sectionLabel}>Notifications</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {items.map(({ key, label, desc }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '13px', color: 'var(--color-text-primary)', marginBottom: '2px' }}>{label}</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>{desc}</p>
            </div>
            <SettingsToggle checked={states[key]} onChange={() => toggle(key)} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationsCard
