import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronRight } from 'lucide-react'
import { useAuth } from '../../state/useAuth'
import { usePreferences } from '../../state/PreferencesContext'
import useMutationQuery from '../../hooks/api/useMutationQuery'
import { transactionQueries, categoryQueries } from '../../utils/dataQuery'
import { preferencesApi } from '../../api/preferences.api'
import type { TransactionWithCategory, Category, Preferences } from '../../types'

// ── Shared primitives ────────────────────────────────────────

const card: React.CSSProperties = {
  background: 'var(--color-bg-surface)',
  border: '0.5px solid rgba(255,255,255,0.06)',
  borderRadius: '12px',
  padding: '24px',
}

const sectionLabel: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--color-text-muted)',
  marginBottom: '16px',
}

const fieldLabel: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--color-text-muted)',
  marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: '8px',
  border: '0.5px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.03)',
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-mono)',
  fontSize: '13px',
  outline: 'none',
  transition: 'border-color 150ms ease',
}

const focusIn  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = 'rgba(77,255,195,0.4)' }
const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }

// ── Toggle switch ────────────────────────────────────────────

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    role='switch'
    aria-checked={checked}
    onClick={onChange}
    style={{
      position: 'relative',
      display: 'inline-flex',
      width: '36px',
      height: '20px',
      borderRadius: '99px',
      border: 'none',
      background: checked ? '#4DFFC3' : 'rgba(255,255,255,0.12)',
      cursor: 'pointer',
      transition: 'background 200ms ease',
      flexShrink: 0,
    }}
  >
    <span
      style={{
        position: 'absolute',
        top: '2px',
        left: checked ? '18px' : '2px',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: checked ? '#0B0F1A' : 'rgba(255,255,255,0.5)',
        transition: 'left 200ms ease, background 200ms ease',
      }}
    />
  </button>
)

// ── Action buttons ───────────────────────────────────────────

const TealBtn = ({
  label,
  onClick,
  disabled = false,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '8px 18px',
      borderRadius: '8px',
      border: 'none',
      background: '#4DFFC3',
      color: '#0B0F1A',
      fontFamily: 'var(--font-ui)',
      fontWeight: 700,
      fontSize: '13px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'opacity 150ms ease, transform 150ms ease',
    }}
    onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'scale(1.03)' } }}
    onMouseLeave={(e) => { e.currentTarget.style.opacity = disabled ? '0.5' : '1'; e.currentTarget.style.transform = 'scale(1)' }}
  >
    {label}
  </button>
)

const DangerBtn = ({
  label,
  onClick,
  disabled = false,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '8px 18px',
      borderRadius: '8px',
      border: '0.5px solid rgba(255,78,122,0.3)',
      background: 'rgba(255,78,122,0.08)',
      color: '#FF4E7A',
      fontFamily: 'var(--font-ui)',
      fontWeight: 600,
      fontSize: '13px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'background 150ms ease, opacity 150ms ease',
    }}
    onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = 'rgba(255,78,122,0.15)' }}
    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,78,122,0.08)' }}
  >
    {label}
  </button>
)

// ── Edit Transaction Card ────────────────────────────────────

const EditTransactionCard = ({
  transaction,
}: {
  transaction: TransactionWithCategory | undefined
}) => {
  const navigate     = useNavigate()
  const queryClient  = useQueryClient()

  const [description, setDescription] = useState(transaction?.description ?? '')
  const [amount,      setAmount]      = useState(String(transaction?.amount ?? ''))
  const [date,        setDate]        = useState(transaction?.date?.slice(0, 10) ?? '')
  const [type,        setType]        = useState<'income' | 'expense'>(transaction?.type ?? 'expense')
  const [categoryId,  setCategoryId]  = useState(String(transaction?.category_id ?? ''))

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: categoryQueries.all(),
    queryFn:  categoryQueries.getCategories,
  })

  const invalidateAndBack = async () => {
    await queryClient.invalidateQueries({ queryKey: transactionQueries.all() })
    navigate(-1)
  }

  const { mutation: updateMutation } = useMutationQuery({
    mutationFn: transactionQueries.updateTransaction,
    options: { onSuccess: invalidateAndBack },
  })

  const { mutation: deleteMutation } = useMutationQuery({
    mutationFn: transactionQueries.deleteTransaction,
    options: { onSuccess: invalidateAndBack },
  })

  // ── Empty state ──────────────────────────────────────────
  if (!transaction) {
    return (
      <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '180px' }}>
        <p style={{ ...sectionLabel, marginBottom: '12px' }}>Edit Transaction</p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text-muted)' }}>
          Select a transaction to edit
        </p>
      </div>
    )
  }

  const isPending = updateMutation.isPending || deleteMutation.isPending

  const handleSave = () => {
    updateMutation.mutate({
      id: transaction.id,
      data: {
        description,
        amount:      Number(amount),
        date,
        type,
        category_id: categoryId ? Number(categoryId) : null,
      },
    })
  }

  const handleDelete = () => {
    deleteMutation.mutate(transaction.id)
  }

  return (
    <div style={card}>
      <p style={sectionLabel}>Edit Transaction</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>

        {/* Description */}
        <div style={{ gridColumn: '1 / -1' }}>
          <p style={fieldLabel}>Description</p>
          <input
            style={inputStyle}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={focusIn}
            onBlur={focusOut}
          />
        </div>

        {/* Amount */}
        <div>
          <p style={fieldLabel}>Amount (£)</p>
          <input
            type='number'
            min='0'
            step='0.01'
            style={inputStyle}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onFocus={focusIn}
            onBlur={focusOut}
          />
        </div>

        {/* Date */}
        <div>
          <p style={fieldLabel}>Date</p>
          <input
            type='date'
            style={{ ...inputStyle, colorScheme: 'dark' }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onFocus={focusIn}
            onBlur={focusOut}
          />
        </div>

        {/* Type */}
        <div>
          <p style={fieldLabel}>Type</p>
          <select
            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
            value={type}
            onChange={(e) => setType(e.target.value as 'income' | 'expense')}
            onFocus={focusIn}
            onBlur={focusOut}
          >
            <option value='income'>Income</option>
            <option value='expense'>Expense</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <p style={fieldLabel}>Category</p>
          <select
            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            onFocus={focusIn}
            onBlur={focusOut}
          >
            <option value=''>Uncategorised</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
        <TealBtn
          label={updateMutation.isPending ? 'Saving…' : 'Save changes'}
          onClick={handleSave}
          disabled={isPending}
        />
        <DangerBtn
          label={deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          onClick={handleDelete}
          disabled={isPending}
        />
      </div>
    </div>
  )
}

// ── Profile Card ─────────────────────────────────────────────

const ProfileCard = ({ email }: { email: string }) => {
  const [name, setName] = useState(() => {
    const local = email.split('@')[0]
    return local.split(/[._-]/).filter(Boolean)
      .map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
  })

  return (
    <div style={card}>
      <p style={sectionLabel}>Profile</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <p style={fieldLabel}>Display name</p>
          <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} onFocus={focusIn} onBlur={focusOut} />
        </div>
        <div>
          <p style={fieldLabel}>Email address</p>
          <input style={{ ...inputStyle, color: 'var(--color-text-muted)', cursor: 'not-allowed' }} value={email} readOnly />
        </div>
        <div>
          <p style={fieldLabel}>Currency</p>
          <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} onFocus={focusIn} onBlur={focusOut}>
            <option value='GBP'>GBP — British Pound (£)</option>
            <option value='USD'>USD — US Dollar ($)</option>
            <option value='EUR'>EUR — Euro (€)</option>
          </select>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <TealBtn label='Save changes' onClick={() => {}} />
      </div>
    </div>
  )
}

// ── Notifications Card ───────────────────────────────────────

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
            <Toggle checked={states[key]} onChange={() => toggle(key)} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Preferences Card ─────────────────────────────────────────

const PREFS_KEY = ['preferences'] as const

function diffPreferences(original: Preferences, current: Preferences): Partial<Preferences> {
  const patch: Partial<Preferences> = {}
  for (const key in current) {
    const k = key as keyof Preferences
    if (current[k] !== original[k]) patch[k] = current[k]
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

  // Populate form (and handle reset) whenever saved data arrives from API
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

  const handleReset = () => { refetch() }

  const resetBtnDisabled = isLoading || patchMutation.isPending

  return (
    <div style={card}>
      <p style={sectionLabel}>Preferences</p>

      {isLoading ? <PrefSkeleton /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Currency */}
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

          {/* Month start day */}
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

          {/* Notification toggles */}
          {([
            { label: 'Budget alerts',      value: notifyBudgetAlerts,   set: setNotifyBudgetAlerts   },
            { label: 'Monthly summary',    value: notifyMonthlySummary, set: setNotifyMonthlySummary },
          ] as const).map(({ label, value, set }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-text-primary)' }}>
                {label}
              </span>
              <Toggle checked={value} onChange={() => set(!value)} />
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <TealBtn
          label={patchMutation.isPending ? 'Saving…' : 'Save changes'}
          onClick={handleSave}
          disabled={isLoading || patchMutation.isPending}
        />
        <button
          onClick={handleReset}
          disabled={resetBtnDisabled}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '0.5px solid rgba(255,255,255,0.08)',
            background: 'transparent',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            cursor: resetBtnDisabled ? 'not-allowed' : 'pointer',
            transition: 'color 150ms ease, border-color 150ms ease',
          }}
          onMouseEnter={(e) => {
            if (!resetBtnDisabled) {
              e.currentTarget.style.color = 'var(--color-text-primary)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-muted)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

// ── Security Card ────────────────────────────────────────────

const SecurityCard = () => {
  const [current,  setCurrent]  = useState('')
  const [next,     setNext]     = useState('')
  const [confirm,  setConfirm]  = useState('')

  return (
    <div style={card}>
      <p style={sectionLabel}>Security</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {([
          { label: 'Current password', value: current, set: setCurrent },
          { label: 'New password',     value: next,    set: setNext    },
          { label: 'Confirm password', value: confirm, set: setConfirm },
        ] as const).map(({ label, value, set }) => (
          <div key={label}>
            <p style={fieldLabel}>{label}</p>
            <input
              type='password'
              style={inputStyle}
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder='••••••••'
              onFocus={focusIn}
              onBlur={focusOut}
            />
          </div>
        ))}
      </div>
      <div style={{ marginTop: '20px' }}>
        <TealBtn label='Save changes' onClick={() => {}} />
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────

const SettingsPage = () => {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()

  // Read transaction passed via router state from a transaction row's Edit button
  const editTransaction = (location.state as { transaction?: TransactionWithCategory } | null)
    ?.transaction

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Breadcrumb */}
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

      {/* Page title */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '28px', letterSpacing: '-0.5px', color: 'var(--color-text-primary)', lineHeight: 1, marginBottom: '8px' }}>
          Settings &amp; preferences
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)' }}>
          Manage your account, notifications, and display preferences.
        </p>
      </div>

      {/* 2×2 card grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }} className='settings-grid'>
        <ProfileCard email={user?.email ?? ''} />
        <NotificationsCard />
        <PreferencesCard />
        <SecurityCard />
        {/* Edit Transaction spans full width — populated when navigated from a transaction row */}
        <div style={{ gridColumn: '1 / -1' }}>
          <EditTransactionCard transaction={editTransaction} />
        </div>
      </div>

    </div>
  )
}

export default SettingsPage
