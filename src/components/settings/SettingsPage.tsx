import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useAuth } from '../../state/useAuth'
import type { TransactionWithCategory } from '../../types'
import ProfileCard         from './ProfileCard'
import NotificationsCard   from './NotificationsCard'
import PreferencesCard     from './PreferencesCard'
import SecurityCard        from './SecurityCard'
import EditTransactionCard from './EditTransactionCard'

const SettingsPage = () => {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()

  const editTransaction = (location.state as { transaction?: TransactionWithCategory } | null)
    ?.transaction

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)', padding: 0, transition: 'color 150ms ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
        >
          Dashboard
        </button>
        <ChevronRight size={12} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-primary)' }}>
          Settings
        </span>
      </nav>

      <div>
        <h1 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '28px', letterSpacing: '-0.5px', color: 'var(--color-text-primary)', lineHeight: 1, marginBottom: '8px' }}>
          Settings &amp; preferences
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)' }}>
          Manage your account, notifications, and display preferences.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }} className='settings-grid'>
        <ProfileCard email={user?.email ?? ''} />
        <NotificationsCard />
        <PreferencesCard />
        <SecurityCard />
        <div style={{ gridColumn: '1 / -1' }}>
          <EditTransactionCard transaction={editTransaction} />
        </div>
      </div>

    </div>
  )
}

export default SettingsPage
