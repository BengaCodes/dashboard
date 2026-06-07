import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../state/useAuth'
import { transactionsApi } from '../../api/transactions.api'
import { categoriesApi }   from '../../api/categories.api'
import type { TransactionWithCategory } from '../../types'
import {
  calculate, fmtGBP,
  RESULT_PERIODS, RESULT_DIVISORS, INPUT_FREQ_DIVISORS, STATE_PENSION_AGE,
  TAX_YEAR_OPTIONS, FREQ_OPTIONS, LOAN_OPTIONS, REGION_OPTIONS,
  type TaxYear, type PayFrequency, type StudentLoan, type Region, type ResultPeriod,
} from '../../utils/taxCalculator'
import { CalcCard, FieldInput, FieldSelect, CalcToggle, inputBaseStyle, labelStyle } from './CalcInputs'
import ResultCard       from './ResultCard'
import PayBreakdownCard from './PayBreakdownCard'
import VisualBreakdownCard from './VisualBreakdownCard'
import CalcHistoryList  from './CalcHistoryList'
import Toast            from '../common/Toast'

const SalaryCalculator = () => {
  const [salary,          setSalary]          = useState('50000')
  const [taxYear,         setTaxYear]         = useState<TaxYear>('2025/26')
  const [frequency,       setFrequency]       = useState<PayFrequency>('monthly')
  const [taxCode,         setTaxCode]         = useState('1257L')
  const [pensionPct,      setPensionPct]      = useState('0')
  const [studentLoan,     setStudentLoan]     = useState<StudentLoan>('none')
  const [blindAllowance,  setBlindAllowance]  = useState(false)
  const [salarySacrifice, setSalarySacrifice] = useState(false)
  const [region,          setRegion]          = useState<Region>('england')
  const [age,             setAge]             = useState('')
  const [resultPeriod,    setResultPeriod]    = useState<ResultPeriod>('annual')
  const [toast,           setToast]           = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [saving,          setSaving]          = useState(false)
  const [history,         setHistory]         = useState<TransactionWithCategory[]>([])
  const [historyTick,     setHistoryTick]     = useState(0)

  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    transactionsApi.getAll({ type: 'income', order: 'desc', limit: 20 })
      .then(txs => setHistory(
        txs.filter(t => t.recurring && t.recurring_frequency === 'monthly').slice(0, 5)
      ))
      .catch(() => {})
  }, [user, historyTick])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4500)
  }

  const friendlyError = (err: unknown): string => {
    const raw = err instanceof Error ? err.message : String(err)
    if (/duplicate|conflict|unique|already exists/i.test(raw))
      return 'You already have a recurring salary saved. Delete the existing one from your dashboard first, then save again.'
    if (/internal server error|500/i.test(raw))
      return 'The server rejected the save — you may already have a recurring income entry. Check your dashboard and remove it before saving again.'
    if (/unauthorized|401|forbidden|403/i.test(raw))
      return 'Your session has expired. Please sign out and sign back in, then try again.'
    if (/fetch|network|Failed to fetch/i.test(raw))
      return 'Unable to reach the server. Check your connection and try again.'
    return raw || 'Something went wrong — please try again.'
  }

  const handleSave = async () => {
    if (!user) {
      navigate('/', { state: { authMessage: 'Sign in to save your calculation' } })
      return
    }
    setSaving(true)
    try {
      const categories  = await categoriesApi.getAll()
      const incomeCat   = categories.find(c =>
        c.type === 'income' && /salary|income|pay|earning/i.test(c.name)
      ) ?? categories.find(c => c.type === 'income')

      // Guard against duplicates — each gross salary should have one entry
      const existing = await transactionsApi.getAll({ type: 'income' })
      const hasDuplicate = existing.some(t =>
        t.recurring &&
        t.recurring_frequency === 'monthly' &&
        t.description === 'Monthly salary (Calculator)'
      )
      if (hasDuplicate) {
        showToast('A monthly salary is already saved. Remove the existing entry from your dashboard to update it.', 'error')
        return
      }

      const monthlyNet = Math.round((result.net / 12) * 100) / 100
      const today      = new Date().toISOString().split('T')[0]
      const base = {
        description:  'Monthly salary (Calculator)',
        amount:       monthlyNet,
        type:         'income' as const,
        category_id:  incomeCat?.id ?? null,
      }

      await transactionsApi.bulkCreate([
        { ...base, date: today, recurring: false },
        { ...base, date: today, recurring: true, recurring_frequency: 'monthly' as const, recurring_end_date: null },
      ])

      setHistoryTick(t => t + 1)
      showToast(`${fmtGBP(monthlyNet, 2)} / mo added — this month and recurring`, 'success')
    } catch (err) {
      showToast(friendlyError(err), 'error')
    } finally {
      setSaving(false)
    }
  }

  const gross  = Math.max(0, parseFloat(salary.replace(/,/g, '')) || 0)
  const ageNum = parseInt(age) || 0

  const result = useMemo(
    () => calculate(gross, parseFloat(pensionPct) || 0, salarySacrifice, studentLoan, taxYear, region, blindAllowance, ageNum),
    [gross, pensionPct, salarySacrifice, studentLoan, taxYear, region, blindAllowance, ageNum],
  )

  const effectiveRate = result.gross > 0
    ? ((result.incomeTax + result.ni) / result.gross) * 100
    : 0
  const marginalRate = result.bands
    .filter(b => b.rate > 0)
    .reduce((m, b) => Math.max(m, b.rate), 0) * 100

  const rdiv = RESULT_DIVISORS[resultPeriod]
  const fmtP = (annual: number) => fmtGBP(annual / rdiv, 0)
  const fmtMo = (annual: number) => `${fmtGBP(annual / 12, 0)} / mo`

  const cards = [
    { key: 'takehome',      label: 'Take-home',          value: fmtP(result.net),       sub: fmtMo(result.net),       accent: '#4DFFC3', bg: 'rgba(77,255,195,0.07)',  border: 'rgba(77,255,195,0.2)',  highlighted: true  },
    { key: 'income-tax',    label: 'Income Tax',          value: fmtP(result.incomeTax), sub: fmtMo(result.incomeTax), accent: '#FF4E7A', bg: 'rgba(255,78,122,0.05)',  border: 'rgba(255,78,122,0.14)'                    },
    { key: 'ni',            label: 'National Insurance',  value: fmtP(result.ni),        sub: fmtMo(result.ni),        accent: '#FFB547', bg: 'rgba(255,181,71,0.05)',  border: 'rgba(255,181,71,0.14)'                    },
    { key: 'pension',       label: 'Pension',             value: fmtP(result.pension),   sub: fmtMo(result.pension),   accent: '#A78BFA', bg: 'rgba(167,139,250,0.05)', border: 'rgba(167,139,250,0.14)'                   },
    { key: 'effective-rate',label: 'Effective Rate',      value: `${effectiveRate.toFixed(1)}%`, sub: 'of gross income',  accent: '#1EC8FF', bg: 'rgba(30,200,255,0.05)', border: 'rgba(30,200,255,0.14)'                 },
    { key: 'marginal-rate', label: 'Marginal Rate',       value: marginalRate > 0 ? `${Math.round(marginalRate)}%` : '0%', sub: 'top income-tax band', accent: '#1EC8FF', bg: 'rgba(30,200,255,0.05)', border: 'rgba(30,200,255,0.14)' },
  ] as const

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      <div
        className='calculator-grid'
        style={{
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          minHeight: '70vh',
          borderRadius: '14px',
          overflow: 'hidden',
          border: '0.5px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* ── Left: Input Panel ───────────────────────────────── */}
        <div style={{
          background: 'var(--color-bg-surface)',
          borderRight: '0.5px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '15px 16px 13px', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <h1 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '14px', color: 'var(--color-text-primary)', margin: 0 }}>
                Salary Calculator
              </h1>
              <div style={{ flexShrink: 0, minWidth: '108px' }}>
                <FieldSelect value={taxYear} onChange={setTaxYear} options={TAX_YEAR_OPTIONS} />
              </div>
            </div>
          </div>

          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1 }}>
            <CalcCard title="Gross Salary">
              <FieldInput label="Annual Gross Amount" value={salary} onChange={setSalary} type="number" prefix="£" min="0" step="1000" large />
              <FieldSelect label="Pay Frequency" value={frequency} onChange={setFrequency} options={FREQ_OPTIONS} />
              <div>
                <span style={labelStyle}>Tax Code</span>
                <input
                  type="text"
                  value={taxCode}
                  onChange={e => setTaxCode(e.target.value.toUpperCase())}
                  style={inputBaseStyle}
                  placeholder="1257L"
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(77,255,195,0.4)' }}
                  onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                />
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '5px', lineHeight: 1.4 }}>
                  Standard 1257L gives £12,570 personal allowance
                </p>
              </div>
            </CalcCard>

            <CalcCard title="Deductions">
              <FieldSelect label="Student Loan Plan" value={studentLoan} onChange={setStudentLoan} options={LOAN_OPTIONS} />
              <FieldInput label="Pension Contribution" value={pensionPct} onChange={setPensionPct} type="number" suffix="%" min="0" max="100" step="0.5" />
              <CalcToggle checked={blindAllowance} onChange={setBlindAllowance} label="Blind person's allowance" hint="+£3,070 added to your personal allowance" />
              <CalcToggle checked={salarySacrifice} onChange={setSalarySacrifice} label="Salary sacrifice" hint="Pension via pre-tax scheme — reduces NI as well as income tax" />
            </CalcCard>

            <CalcCard title="Location">
              <FieldSelect label="Region" value={region} onChange={setRegion} options={REGION_OPTIONS} />
              <div>
                <FieldInput label="Age" value={age} onChange={setAge} type="number" min="16" max="100" placeholder="e.g. 30" />
                {ageNum > 0 && ageNum >= STATE_PENSION_AGE && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#4DFFC3', marginTop: '5px' }}>
                    Over state pension age — NI exempt
                  </p>
                )}
              </div>
            </CalcCard>

            <button
              onClick={() => document.getElementById('calc-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              style={{
                width: '100%', padding: '11px 0', borderRadius: '10px',
                border: '1px solid rgba(77,255,195,0.25)', background: 'rgba(77,255,195,0.1)',
                color: '#4DFFC3', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '13px',
                cursor: 'pointer', letterSpacing: '0.01em',
                transition: 'background 150ms ease, border-color 150ms ease', marginTop: '2px',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(77,255,195,0.18)'; e.currentTarget.style.borderColor = 'rgba(77,255,195,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(77,255,195,0.1)';  e.currentTarget.style.borderColor = 'rgba(77,255,195,0.25)' }}
            >
              Calculate take-home
            </button>

            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#D97706', lineHeight: 1.55,
              padding: '9px 12px', borderRadius: '8px',
              background: 'rgba(245,158,11,0.05)', border: '0.5px solid rgba(245,158,11,0.18)', marginBottom: '4px',
            }}>
              Estimates only. Figures are for guidance and do not constitute financial or tax advice.
            </p>
          </div>
        </div>

        {/* ── Right: Results Panel ─────────────────────────────── */}
        <div id="calc-results" style={{ background: 'var(--color-bg-base)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px 0', borderBottom: '0.5px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
              <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '3px', gap: '2px' }}>
                {RESULT_PERIODS.map(p => {
                  const active = p.value === resultPeriod
                  return (
                    <button
                      key={p.value}
                      onClick={() => setResultPeriod(p.value)}
                      style={{
                        padding: '5px 14px', borderRadius: '7px', border: 'none',
                        background: active ? 'rgba(77,255,195,0.12)' : 'transparent',
                        color: active ? '#4DFFC3' : 'var(--color-text-muted)',
                        fontFamily: 'var(--font-ui)', fontWeight: active ? 700 : 400, fontSize: '12px',
                        cursor: 'pointer', transition: 'all 150ms ease',
                      }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--color-text-primary)' }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--color-text-muted)' }}
                    >
                      {p.label}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  flexShrink: 0, padding: '6px 14px', borderRadius: '8px',
                  border: '0.5px solid rgba(77,255,195,0.22)',
                  background: saving ? 'rgba(77,255,195,0.05)' : 'rgba(77,255,195,0.08)',
                  color: saving ? 'rgba(77,255,195,0.4)' : '#4DFFC3',
                  fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '12px',
                  cursor: saving ? 'default' : 'pointer', transition: 'all 150ms ease',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
                onMouseEnter={e => { if (!saving) { e.currentTarget.style.background = 'rgba(77,255,195,0.14)'; e.currentTarget.style.borderColor = 'rgba(77,255,195,0.38)' } }}
                onMouseLeave={e => { if (!saving) { e.currentTarget.style.background = 'rgba(77,255,195,0.08)'; e.currentTarget.style.borderColor = 'rgba(77,255,195,0.22)' } }}
              >
                <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <polyline points='16 16 12 12 8 16' />
                  <line x1='12' y1='12' x2='12' y2='21' />
                  <path d='M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3' />
                </svg>
                {saving ? 'Saving…' : 'Save to dashboard'}
              </button>
            </div>

            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
              Based on{' '}
              <span style={{ color: 'var(--color-text-primary)' }}>{fmtGBP(gross)} gross</span>
              {' · '}Tax code{' '}
              <span style={{ color: 'var(--color-text-primary)' }}>{taxCode || '—'}</span>
              {INPUT_FREQ_DIVISORS[frequency] !== 1 && (
                <> · <span style={{ color: 'var(--color-text-primary)' }}>{frequency}</span></>
              )}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', padding: '18px 20px', overflowY: 'auto', flex: 1, alignContent: 'start' }}>
            {cards.map(c => (
              <ResultCard
                key={c.key}
                label={c.label}
                value={c.value}
                sub={c.sub}
                accent={c.accent}
                bg={c.bg}
                border={c.border}
                highlighted={'highlighted' in c ? c.highlighted : false}
              />
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '0.5px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <PayBreakdownCard result={result} rdiv={rdiv} />
            <VisualBreakdownCard result={result} region={region} />
          </div>
        </div>
      </div>

      {user && history.length > 0 && <CalcHistoryList history={history} />}
    </>
  )
}

export default SalaryCalculator
