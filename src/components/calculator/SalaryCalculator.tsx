import { useState, useMemo, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../state/useAuth'
import { calculatorApi } from '../../api/calculator.api'
import type { CalcSnapshot } from '../../api/calculator.api'

// ── Types ────────────────────────────────────────────────────

type TaxYear      = '2025/26' | '2026/27'
type PayFrequency = 'monthly' | 'weekly' | 'quarterly' | 'annually'
type StudentLoan  = 'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgrad'
type Region       = 'england' | 'wales' | 'ni' | 'scotland'
type ResultPeriod = 'annual' | 'monthly' | 'weekly' | 'daily'

// ── Constants ────────────────────────────────────────────────

const BLIND_ALLOWANCE   = 3_070
const STATE_PENSION_AGE = 66
const PA_BASE           = 12_570

const RESULT_PERIODS: { value: ResultPeriod; label: string }[] = [
  { value: 'annual',  label: 'Annual'  },
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly',  label: 'Weekly'  },
  { value: 'daily',   label: 'Daily'   },
]

const RESULT_DIVISORS: Record<ResultPeriod, number> = {
  annual: 1, monthly: 12, weekly: 52, daily: 260,
}

// ── Tax band definitions ─────────────────────────────────────

type TaxBandDef = { limit: number; rate: number; label: string; color: string }

const RUK_BANDS: TaxBandDef[] = [
  { limit: 37_700,   rate: 0.20, label: 'Basic rate (20%)',      color: '#1EC8FF' },
  { limit: 112_570,  rate: 0.40, label: 'Higher rate (40%)',     color: '#FFB547' },
  { limit: Infinity, rate: 0.45, label: 'Additional rate (45%)', color: '#FF4E7A' },
]

const SCO_BANDS: TaxBandDef[] = [
  { limit: 2_827,    rate: 0.19, label: 'Starter rate (19%)',      color: '#93C5FD' },
  { limit: 14_921,   rate: 0.20, label: 'Basic rate (20%)',        color: '#1EC8FF' },
  { limit: 31_092,   rate: 0.21, label: 'Intermediate rate (21%)', color: '#6EE7B7' },
  { limit: 62_430,   rate: 0.42, label: 'Higher rate (42%)',       color: '#FFB547' },
  { limit: 112_570,  rate: 0.45, label: 'Advanced rate (45%)',     color: '#FF8A4C' },
  { limit: Infinity, rate: 0.48, label: 'Top rate (48%)',          color: '#FF4E7A' },
]

const NI_CONFIG = {
  '2025/26': { pt: 12_570, uel: 50_270, main: 0.08, upper: 0.02 },
  '2026/27': { pt: 12_570, uel: 50_270, main: 0.08, upper: 0.02 },
} as const

const STUDENT_LOAN_TABLE: Record<StudentLoan, { threshold: number; rate: number } | null> = {
  none:     null,
  plan1:    { threshold: 24_990, rate: 0.09 },
  plan2:    { threshold: 27_295, rate: 0.09 },
  plan4:    { threshold: 31_395, rate: 0.09 },
  plan5:    { threshold: 25_000, rate: 0.09 },
  postgrad: { threshold: 21_000, rate: 0.06 },
}

const INPUT_FREQ_DIVISORS: Record<PayFrequency, number> = {
  monthly: 12, weekly: 52, quarterly: 4, annually: 1,
}

// ── Calculation engine ───────────────────────────────────────

type Band = { label: string; taxable: number; rate: number; tax: number; color: string }
type Calc = {
  gross: number; pension: number; incomeTax: number
  ni: number; studentLoan: number; net: number; bands: Band[]
}

function computeBands(
  taxableIncome: number,
  defs: TaxBandDef[],
  pa: number,
  afterPension: number,
): Band[] {
  const out: Band[] = [{
    label: 'Personal allowance',
    taxable: Math.min(afterPension, pa),
    rate: 0, tax: 0, color: 'rgba(255,255,255,0.06)',
  }]
  let remaining = taxableIncome
  let prev = 0
  for (const d of defs) {
    if (remaining <= 0) break
    const width  = d.limit === Infinity ? remaining : d.limit - prev
    const inBand = Math.min(remaining, width)
    if (inBand > 0) {
      out.push({ label: d.label, taxable: inBand, rate: d.rate, tax: inBand * d.rate, color: d.color })
      remaining -= inBand
    }
    if (d.limit !== Infinity) prev = d.limit
  }
  return out.filter(b => b.taxable > 0)
}

function calculate(
  gross: number,
  pensionPct: number,
  salarySacrifice: boolean,
  loan: StudentLoan,
  taxYear: TaxYear,
  region: Region,
  blind: boolean,
  age: number,
): Calc {
  const ni         = NI_CONFIG[taxYear]
  const bandDefs   = region === 'scotland' ? SCO_BANDS : RUK_BANDS
  const pension    = gross * (pensionPct / 100)
  const afterPension = Math.max(0, gross - pension)

  const basePa = PA_BASE + (blind ? BLIND_ALLOWANCE : 0)
  const pa     = gross > 100_000
    ? Math.max(0, basePa - Math.floor((gross - 100_000) / 2))
    : basePa

  const taxableIncome = Math.max(0, afterPension - pa)
  const bands         = computeBands(taxableIncome, bandDefs, pa, afterPension)
  const incomeTax     = bands.reduce((s, b) => s + b.tax, 0)

  const niableGross = salarySacrifice ? Math.max(0, gross - pension) : gross
  const niExempt    = age > 0 && age >= STATE_PENSION_AGE
  let niAmount = 0
  if (!niExempt) {
    const niMain  = niableGross > ni.pt  ? Math.min(niableGross - ni.pt, ni.uel - ni.pt) * ni.main  : 0
    const niUpper = niableGross > ni.uel ? (niableGross - ni.uel) * ni.upper : 0
    niAmount = niMain + niUpper
  }

  const slCfg       = STUDENT_LOAN_TABLE[loan]
  const studentLoan = slCfg && gross > slCfg.threshold
    ? (gross - slCfg.threshold) * slCfg.rate
    : 0

  const net = gross - pension - incomeTax - niAmount - studentLoan
  return { gross, pension, incomeTax, ni: niAmount, studentLoan, net, bands }
}

// ── Formatting helpers ───────────────────────────────────────

const fmt = (n: number, dp = 0) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency', currency: 'GBP',
    minimumFractionDigits: dp, maximumFractionDigits: dp,
  }).format(n)



// ── Shared styles ────────────────────────────────────────────

const S = {
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    color: 'var(--color-text-muted)',
    marginBottom: '5px',
    display: 'block',
  },
  input: {
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
    colorScheme: 'dark' as const,
    boxSizing: 'border-box' as const,
  },
}

// ── Input sub-components ─────────────────────────────────────

const Card = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{
    borderRadius: '10px',
    border: '0.5px solid rgba(255,255,255,0.07)',
    background: 'rgba(255,255,255,0.015)',
    overflow: 'hidden',
  }}>
    <div style={{
      padding: '7px 14px',
      borderBottom: '0.5px solid rgba(255,255,255,0.06)',
      background: 'rgba(255,255,255,0.02)',
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: 'rgba(255,255,255,0.35)',
      }}>
        {title}
      </span>
    </div>
    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {children}
    </div>
  </div>
)

const FieldInput = ({
  label, value, onChange,
  type = 'text', prefix, suffix, placeholder, min, max, step, large,
}: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; prefix?: string; suffix?: string; placeholder?: string
  min?: string; max?: string; step?: string; large?: boolean
}) => (
  <div>
    <span style={S.label}>{label}</span>
    <div style={{ position: 'relative' }}>
      {prefix && (
        <span style={{
          position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
          fontFamily: 'var(--font-mono)',
          fontSize: large ? '15px' : '13px',
          color: '#4DFFC3',
          pointerEvents: 'none', userSelect: 'none',
        }}>
          {prefix}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        min={min} max={max} step={step}
        style={{
          ...S.input,
          paddingLeft: prefix ? (large ? '24px' : '22px') : '12px',
          paddingRight: suffix ? '32px' : '12px',
          fontSize: large ? '15px' : '13px',
          fontWeight: large ? 700 : 400,
        }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(77,255,195,0.4)' }}
        onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
      />
      {suffix && (
        <span style={{
          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
          fontFamily: 'var(--font-mono)', fontSize: '11px',
          color: 'var(--color-text-muted)', pointerEvents: 'none',
        }}>
          {suffix}
        </span>
      )}
    </div>
  </div>
)

const FieldSelect = <T extends string>({
  label, value, onChange, options,
}: {
  label?: string; value: T; onChange: (v: T) => void
  options: { value: T; label: string }[]
}) => (
  <div>
    {label && <span style={S.label}>{label}</span>}
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value as T)}
        style={{ ...S.input, appearance: 'none', paddingRight: '28px', cursor: 'pointer' }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(77,255,195,0.4)' }}
        onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <svg width='10' height='10' viewBox='0 0 12 12' style={{
        position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
        pointerEvents: 'none', color: 'var(--color-text-muted)',
      }}>
        <path d='M2 4l4 4 4-4' stroke='currentColor' strokeWidth='1.5' fill='none' strokeLinecap='round' strokeLinejoin='round' />
      </svg>
    </div>
  </div>
)

const Toggle = ({
  checked, onChange, label, hint,
}: {
  checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string
}) => (
  <div
    style={{
      display: 'flex', alignItems: 'flex-start',
      justifyContent: 'space-between', gap: '12px',
      cursor: 'pointer', userSelect: 'none',
    }}
    onClick={() => onChange(!checked)}
  >
    <div style={{ flex: 1, minWidth: 0 }}>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-text-primary)' }}>
        {label}
      </span>
      {hint && (
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px',
          color: 'var(--color-text-muted)', marginTop: '2px', lineHeight: 1.4,
        }}>
          {hint}
        </p>
      )}
    </div>
    <div style={{
      flexShrink: 0, marginTop: '2px',
      width: '34px', height: '18px', borderRadius: '99px',
      background: checked ? 'rgba(77,255,195,0.18)' : 'rgba(255,255,255,0.06)',
      border: `1px solid ${checked ? 'rgba(77,255,195,0.45)' : 'rgba(255,255,255,0.12)'}`,
      position: 'relative', transition: 'all 180ms ease',
    }}>
      <div style={{
        position: 'absolute', top: '2px',
        left: checked ? '16px' : '2px',
        width: '12px', height: '12px', borderRadius: '99px',
        background: checked ? '#4DFFC3' : 'rgba(255,255,255,0.3)',
        transition: 'all 180ms ease',
        boxShadow: checked ? '0 0 6px rgba(77,255,195,0.4)' : 'none',
      }} />
    </div>
  </div>
)

// ── Toast ────────────────────────────────────────────────────

const Toast = ({
  message,
  type,
  onDismiss,
}: {
  message: string
  type: 'success' | 'error'
  onDismiss: () => void
}) => {
  const ok = type === 'success'
  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        padding: '11px 16px',
        borderRadius: '10px',
        background: ok ? '#071510' : '#150710',
        border: `0.5px solid ${ok ? 'rgba(77,255,195,0.28)' : 'rgba(255,78,122,0.28)'}`,
        color: ok ? '#4DFFC3' : '#FF4E7A',
        fontFamily: 'var(--font-ui)',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
        backdropFilter: 'blur(12px)',
        animation: 'slideInFromRight 200ms ease both',
        userSelect: 'none',
        maxWidth: '340px',
      }}
    >
      <span style={{ fontSize: '15px', lineHeight: 1 }}>{ok ? '✓' : '✕'}</span>
      {message}
    </div>
  )
}

// ── Calculation history list ──────────────────────────────────

const CalcHistoryList = ({ history }: { history: CalcSnapshot[] }) => (
  <div style={{
    marginTop: '14px',
    borderRadius: '12px',
    border: '0.5px solid rgba(255,255,255,0.06)',
    background: 'var(--color-bg-surface)',
    overflow: 'hidden',
  }}>
    <div style={{
      padding: '10px 18px',
      borderBottom: '0.5px solid rgba(255,255,255,0.06)',
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: '9px',
        textTransform: 'uppercase', letterSpacing: '0.12em',
        color: 'rgba(255,255,255,0.3)',
      }}>
        Recent Calculations
      </span>
    </div>
    {history.map((snap, i) => (
      <div
        key={snap.id}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto',
          gap: '20px',
          padding: '9px 18px',
          alignItems: 'center',
          borderTop: i > 0 ? '0.5px solid rgba(255,255,255,0.04)' : 'none',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
          {new Date(snap.savedAt).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-primary)' }}>
          {fmt(snap.gross)} gross
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#4DFFC3' }}>
          {fmt(snap.takehome)} take-home
        </span>
      </div>
    ))}
  </div>
)

// ── Pay breakdown card ───────────────────────────────────────

const PayBreakdownCard = ({
  result,
  rdiv,
}: {
  result: Calc
  rdiv: number
}) => {
  const { gross, pension, incomeTax, ni, net } = result
  const ofGross = (v: number) => gross > 0 ? (v / gross) * 100 : 0
  const fmtP    = (v: number) => fmt(v / rdiv, 0)
  const fmtMo   = (v: number) => `${fmt(v / 12, 0)} / mo`
  const fmtPct  = (v: number, neg: boolean) =>
    `${neg ? '−' : ''}${v.toFixed(1)}%`

  const rows = [
    { dot: '#4DFFC3', name: 'Gross salary',      pctVal: 100,              deduction: false, annual: gross,     takehome: false },
    { dot: '#A78BFA', name: 'Pension',            pctVal: ofGross(pension),   deduction: true,  annual: pension,   takehome: false },
    { dot: '#FF4E7A', name: 'Income tax',         pctVal: ofGross(incomeTax), deduction: true,  annual: incomeTax, takehome: false },
    { dot: '#FFB547', name: 'National Insurance', pctVal: ofGross(ni),        deduction: true,  annual: ni,        takehome: false },
    { dot: '#4DFFC3', name: 'Take-home',          pctVal: ofGross(net),       deduction: false, annual: net,       takehome: true  },
  ].filter(r => !r.deduction || r.annual > 0)

  return (
    <div style={{ padding: '16px 20px 20px' }}>
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: '9px',
        textTransform: 'uppercase', letterSpacing: '0.12em',
        color: 'rgba(255,255,255,0.3)', marginBottom: '10px',
      }}>
        Pay Breakdown
      </p>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map((row, idx) => {
          const isTH    = row.takehome
          const showSep = idx > 0 && !isTH
          return (
            <div
              key={row.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                gap: '12px',
                ...(isTH ? {
                  padding: '9px 10px',
                  marginTop: '8px',
                  borderRadius: '8px',
                  background: 'rgba(77,255,195,0.05)',
                  border: '0.5px solid rgba(77,255,195,0.2)',
                } : {
                  padding: '7px 0',
                  borderTop: showSep ? '0.5px solid rgba(255,255,255,0.04)' : 'none',
                }),
              }}
            >
              {/* Left: dot · name · pct */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '99px',
                  background: row.dot, flexShrink: 0,
                  boxShadow: `0 0 5px ${row.dot}70`,
                }} />
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '12px',
                  color: isTH ? '#4DFFC3' : 'var(--color-text-primary)',
                  fontWeight: isTH ? 600 : 400,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {row.name}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '10px',
                  color: isTH ? 'rgba(77,255,195,0.55)' : 'var(--color-text-muted)',
                  flexShrink: 0,
                }}>
                  {fmtPct(row.pctVal, row.deduction)}
                </span>
              </div>

              {/* Right: period amount + monthly sub */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1px' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '13px',
                  color: isTH ? '#4DFFC3' : 'var(--color-text-primary)',
                  fontWeight: isTH ? 600 : 400,
                  letterSpacing: '-0.3px',
                }}>
                  {fmtP(row.annual)}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '10px',
                  color: 'rgba(255,255,255,0.2)',
                }}>
                  {fmtMo(row.annual)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Visual breakdown card ───────────────────────────────────

// Full band lists include zero-income bands so all rows always render
const FULL_RUK_BANDS: { label: string; rate: number; color: string }[] = [
  { label: 'Personal allowance',    rate: 0,    color: 'rgba(255,255,255,0.25)' },
  { label: 'Basic rate (20%)',      rate: 0.20, color: '#1EC8FF'               },
  { label: 'Higher rate (40%)',     rate: 0.40, color: '#FFB547'               },
  { label: 'Additional rate (45%)', rate: 0.45, color: '#FF4E7A'               },
]

const FULL_SCO_BANDS: { label: string; rate: number; color: string }[] = [
  { label: 'Personal allowance',      rate: 0,    color: 'rgba(255,255,255,0.25)' },
  { label: 'Starter rate (19%)',      rate: 0.19, color: '#93C5FD'               },
  { label: 'Basic rate (20%)',        rate: 0.20, color: '#1EC8FF'               },
  { label: 'Intermediate rate (21%)', rate: 0.21, color: '#6EE7B7'               },
  { label: 'Higher rate (42%)',       rate: 0.42, color: '#FFB547'               },
  { label: 'Advanced rate (45%)',     rate: 0.45, color: '#FF8A4C'               },
  { label: 'Top rate (48%)',          rate: 0.48, color: '#FF4E7A'               },
]

const VisualBreakdownCard = ({
  result,
  region,
}: {
  result: Calc
  region: Region
}) => {
  const { gross, net, incomeTax, ni, pension } = result
  const ofGross = (v: number) => gross > 0 ? (v / gross) * 100 : 0

  const bars = [
    { label: 'Take-home',          value: net,       color: '#4DFFC3' },
    { label: 'Income tax',         value: incomeTax, color: '#FF4E7A' },
    { label: 'National Insurance', value: ni,        color: '#FFB547' },
    { label: 'Pension',            value: pension,   color: '#A78BFA' },
  ]

  const fullList = region === 'scotland' ? FULL_SCO_BANDS : FULL_RUK_BANDS
  const displayBands = fullList.map(def => {
    const actual = result.bands.find(b => b.label === def.label)
    return { ...def, taxable: actual?.taxable ?? 0, tax: actual?.tax ?? 0 }
  })

  const isHigherRatePayer = result.bands.some(b => b.rate >= 0.40 && b.taxable > 0)

  return (
    <div style={{
      padding: '16px 20px 20px',
      borderLeft: '0.5px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── Progress bars ────────────────────────────────────── */}
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: '9px',
        textTransform: 'uppercase', letterSpacing: '0.12em',
        color: 'rgba(255,255,255,0.3)', marginBottom: '12px',
      }}>
        Visual Breakdown
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
        {bars.map(bar => {
          const barPct = ofGross(bar.value)
          return (
            <div key={bar.label}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '5px',
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '11px',
                  color: 'var(--color-text-muted)',
                }}>
                  {bar.label}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '11px',
                  color: bar.color,
                }}>
                  {barPct.toFixed(1)}%
                </span>
              </div>
              {/* 6px animated track */}
              <div style={{
                height: '6px', borderRadius: '99px',
                background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
              }}>
                <div style={{
                  height: '6px',
                  width: `${barPct}%`,
                  background: bar.color,
                  borderRadius: '99px',
                  transition: 'width 0.4s ease-out',
                }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Divider ──────────────────────────────────────────── */}
      <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.06)', marginBottom: '14px' }} />

      {/* ── Tax band table ───────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '9px',
          textTransform: 'uppercase', letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.3)',
        }}>
          Tax Bands
        </p>
        {isHigherRatePayer && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '8px',
            letterSpacing: '0.06em',
            color: '#FF4E7A',
            background: 'rgba(255,78,122,0.1)',
            border: '0.5px solid rgba(255,78,122,0.22)',
            borderRadius: '4px',
            padding: '1px 5px',
          }}>
            Higher rate
          </span>
        )}
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 76px 68px',
        gap: '8px', paddingBottom: '6px',
        borderBottom: '0.5px solid rgba(255,255,255,0.05)',
        marginBottom: '2px',
      }}>
        {['Band', 'In band', 'Tax'].map((h, i) => (
          <span key={h} style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.2)',
            textAlign: i > 0 ? 'right' : 'left',
          }}>
            {h}
          </span>
        ))}
      </div>

      {/* Band rows */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {displayBands.map((band, idx) => {
          const isHigh  = band.rate >= 0.40 && band.taxable > 0
          const isEmpty = band.taxable === 0
          return (
            <div
              key={band.label}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 76px 68px',
                gap: '8px', padding: '5px 0',
                borderTop: idx > 0 ? '0.5px solid rgba(255,255,255,0.04)' : 'none',
              }}
            >
              {/* Dot + band name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                <div style={{
                  width: '5px', height: '5px', borderRadius: '99px', flexShrink: 0,
                  background: isEmpty ? 'rgba(255,255,255,0.08)' : band.color,
                  boxShadow: !isEmpty ? `0 0 4px ${band.color}60` : 'none',
                }} />
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '10px',
                  color: isHigh  ? '#FF4E7A'
                       : isEmpty ? 'rgba(255,255,255,0.2)'
                       : 'var(--color-text-muted)',
                  fontWeight: isHigh ? 600 : 400,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {band.label}
                </span>
              </div>

              {/* Amount in band */}
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px', textAlign: 'right',
                color: isHigh  ? '#FF4E7A'
                     : isEmpty ? 'rgba(255,255,255,0.15)'
                     : 'var(--color-text-primary)',
                fontWeight: isHigh ? 600 : 400,
              }}>
                {isEmpty ? '—' : fmt(band.taxable)}
              </span>

              {/* Tax charged */}
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px', textAlign: 'right',
                color: isHigh         ? '#FF4E7A'
                     : isEmpty        ? 'rgba(255,255,255,0.15)'
                     : band.rate > 0  ? 'rgba(255,78,122,0.7)'
                     : 'rgba(255,255,255,0.2)',
                fontWeight: isHigh ? 600 : 400,
              }}>
                {isEmpty       ? '—'
                 : band.rate > 0 ? `−${fmt(band.tax)}`
                 : 'Free'}
              </span>
            </div>
          )
        })}
      </div>

    </div>
  )
}

// ── Result card ──────────────────────────────────────────────

const ResultCard = ({
  label, value, sub, accent, bg, border, highlighted = false,
}: {
  label: string; value: string; sub: string
  accent: string; bg: string; border: string; highlighted?: boolean
}) => (
  <div style={{
    padding: highlighted ? '18px 16px' : '16px',
    borderRadius: '12px',
    background: bg,
    border: `0.5px solid ${border}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    boxShadow: highlighted ? `0 0 24px ${accent}18` : 'none',
  }}>
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '9px',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: 'var(--color-text-muted)',
    }}>
      {label}
    </span>
    <span style={{
      fontFamily: 'var(--font-ui)',
      fontWeight: 800,
      fontSize: highlighted ? '28px' : '22px',
      letterSpacing: highlighted ? '-1px' : '-0.5px',
      color: accent,
      lineHeight: 1.1,
    }}>
      {value}
    </span>
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '10px',
      color: 'rgba(255,255,255,0.25)',
      marginTop: '1px',
    }}>
      {sub}
    </span>
  </div>
)

// ── Option data ──────────────────────────────────────────────

const TAX_YEAR_OPTIONS: { value: TaxYear; label: string }[] = [
  { value: '2025/26', label: '2025 / 26' },
  { value: '2026/27', label: '2026 / 27' },
]

const FREQ_OPTIONS: { value: PayFrequency; label: string }[] = [
  { value: 'monthly',   label: 'Monthly'   },
  { value: 'weekly',    label: 'Weekly'    },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually',  label: 'Annually'  },
]

const LOAN_OPTIONS: { value: StudentLoan; label: string }[] = [
  { value: 'none',     label: 'None'         },
  { value: 'plan1',    label: 'Plan 1'        },
  { value: 'plan2',    label: 'Plan 2'        },
  { value: 'plan4',    label: 'Plan 4'        },
  { value: 'plan5',    label: 'Plan 5'        },
  { value: 'postgrad', label: 'Postgraduate'  },
]

const REGION_OPTIONS: { value: Region; label: string }[] = [
  { value: 'england',  label: 'England'          },
  { value: 'wales',    label: 'Wales'             },
  { value: 'ni',       label: 'Northern Ireland'  },
  { value: 'scotland', label: 'Scotland'          },
]

// ── Main component ───────────────────────────────────────────

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
  const [history,         setHistory]         = useState<CalcSnapshot[]>([])
  const [historyTick,     setHistoryTick]     = useState(0)

  const navigate = useNavigate()
  const { user } = useAuth()

  // Fetch last 5 saved calculations whenever user or historyTick changes
  useEffect(() => {
    if (!user) return
    calculatorApi.getHistory()
      .then(data => setHistory(data.slice(0, 5)))
      .catch(() => {}) // silently fail — endpoint may not be deployed yet
  }, [user, historyTick])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3200)
  }

  const handleSave = async () => {
    if (!user) {
      navigate('/', { state: { authMessage: 'Sign in to save your calculation' } })
      return
    }
    setSaving(true)
    try {
      await calculatorApi.save({
        inputs: {
          gross,
          pensionPct:      parseFloat(pensionPct) || 0,
          region,
          age:             ageNum,
          studentLoan,
          blindAllowance,
          salarySacrifice,
          taxCode,
          taxYear,
        },
        results: {
          takehome:      result.net,
          incomeTax:     result.incomeTax,
          ni:            result.ni,
          pension:       result.pension,
          effectiveRate,
          marginalRate,
        },
      })
      setHistoryTick(t => t + 1)
      showToast('Calculation saved to dashboard', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save — please try again', 'error')
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

  // Derived rates
  const effectiveRate = result.gross > 0
    ? ((result.incomeTax + result.ni) / result.gross) * 100
    : 0
  const marginalRate = result.bands
    .filter(b => b.rate > 0)
    .reduce((m, b) => Math.max(m, b.rate), 0) * 100

  // Per-period formatting
  const rdiv = RESULT_DIVISORS[resultPeriod]
  const fmtP = (annual: number) => fmt(annual / rdiv, 0)
  const fmtMo = (annual: number) => `${fmt(annual / 12, 0)} / mo`

  // Card definitions — computed each render from live result
  const cards = [
    {
      key: 'takehome',
      label: 'Take-home',
      value: fmtP(result.net),
      sub: fmtMo(result.net),
      accent: '#4DFFC3',
      bg: 'rgba(77,255,195,0.07)',
      border: 'rgba(77,255,195,0.2)',
      highlighted: true,
    },
    {
      key: 'income-tax',
      label: 'Income Tax',
      value: fmtP(result.incomeTax),
      sub: fmtMo(result.incomeTax),
      accent: '#FF4E7A',
      bg: 'rgba(255,78,122,0.05)',
      border: 'rgba(255,78,122,0.14)',
    },
    {
      key: 'ni',
      label: 'National Insurance',
      value: fmtP(result.ni),
      sub: fmtMo(result.ni),
      accent: '#FFB547',
      bg: 'rgba(255,181,71,0.05)',
      border: 'rgba(255,181,71,0.14)',
    },
    {
      key: 'pension',
      label: 'Pension',
      value: fmtP(result.pension),
      sub: fmtMo(result.pension),
      accent: '#A78BFA',
      bg: 'rgba(167,139,250,0.05)',
      border: 'rgba(167,139,250,0.14)',
    },
    {
      key: 'effective-rate',
      label: 'Effective Rate',
      value: `${effectiveRate.toFixed(1)}%`,
      sub: 'of gross income',
      accent: '#1EC8FF',
      bg: 'rgba(30,200,255,0.05)',
      border: 'rgba(30,200,255,0.14)',
    },
    {
      key: 'marginal-rate',
      label: 'Marginal Rate',
      value: marginalRate > 0 ? `${Math.round(marginalRate)}%` : '0%',
      sub: 'top income-tax band',
      accent: '#1EC8FF',
      bg: 'rgba(30,200,255,0.05)',
      border: 'rgba(30,200,255,0.14)',
    },
  ] as const

  return (
    <>
    {/* Toast notification */}
    {toast && (
      <Toast
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast(null)}
      />
    )}

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
        {/* Panel header */}
        <div style={{ padding: '15px 16px 13px', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <h1 style={{
              fontFamily: 'var(--font-ui)', fontWeight: 700,
              fontSize: '14px', color: 'var(--color-text-primary)', margin: 0,
            }}>
              Salary Calculator
            </h1>
            <div style={{ flexShrink: 0, minWidth: '108px' }}>
              <FieldSelect value={taxYear} onChange={setTaxYear} options={TAX_YEAR_OPTIONS} />
            </div>
          </div>
        </div>

        {/* Cards + CTA */}
        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1 }}>

          <Card title="Gross Salary">
            <FieldInput
              label="Annual Gross Amount"
              value={salary}
              onChange={setSalary}
              type="number"
              prefix="£"
              min="0"
              step="1000"
              large
            />
            <FieldSelect
              label="Pay Frequency"
              value={frequency}
              onChange={setFrequency}
              options={FREQ_OPTIONS}
            />
            <div>
              <span style={S.label}>Tax Code</span>
              <input
                type="text"
                value={taxCode}
                onChange={e => setTaxCode(e.target.value.toUpperCase())}
                style={S.input}
                placeholder="1257L"
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(77,255,195,0.4)' }}
                onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
              />
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                color: 'var(--color-text-muted)', marginTop: '5px', lineHeight: 1.4,
              }}>
                Standard 1257L gives £12,570 personal allowance
              </p>
            </div>
          </Card>

          <Card title="Deductions">
            <FieldSelect
              label="Student Loan Plan"
              value={studentLoan}
              onChange={setStudentLoan}
              options={LOAN_OPTIONS}
            />
            <FieldInput
              label="Pension Contribution"
              value={pensionPct}
              onChange={setPensionPct}
              type="number"
              suffix="%"
              min="0"
              max="100"
              step="0.5"
            />
            <Toggle
              checked={blindAllowance}
              onChange={setBlindAllowance}
              label="Blind person's allowance"
              hint="+£3,070 added to your personal allowance"
            />
            <Toggle
              checked={salarySacrifice}
              onChange={setSalarySacrifice}
              label="Salary sacrifice"
              hint="Pension via pre-tax scheme — reduces NI as well as income tax"
            />
          </Card>

          <Card title="Location">
            <FieldSelect
              label="Region"
              value={region}
              onChange={setRegion}
              options={REGION_OPTIONS}
            />
            <div>
              <FieldInput
                label="Age"
                value={age}
                onChange={setAge}
                type="number"
                min="16"
                max="100"
                placeholder="e.g. 30"
              />
              {ageNum > 0 && ageNum >= STATE_PENSION_AGE && (
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: '10px',
                  color: '#4DFFC3', marginTop: '5px',
                }}>
                  Over state pension age — NI exempt
                </p>
              )}
            </div>
          </Card>

          {/* CTA — recalculation is live; button scrolls to results on mobile */}
          <button
            onClick={() =>
              document.getElementById('calc-results')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
            style={{
              width: '100%',
              padding: '11px 0',
              borderRadius: '10px',
              border: '1px solid rgba(77,255,195,0.25)',
              background: 'rgba(77,255,195,0.1)',
              color: '#4DFFC3',
              fontFamily: 'var(--font-ui)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              letterSpacing: '0.01em',
              transition: 'background 150ms ease, border-color 150ms ease',
              marginTop: '2px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background    = 'rgba(77,255,195,0.18)'
              e.currentTarget.style.borderColor   = 'rgba(77,255,195,0.45)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background    = 'rgba(77,255,195,0.1)'
              e.currentTarget.style.borderColor   = 'rgba(77,255,195,0.25)'
            }}
          >
            Calculate take-home
          </button>

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: '#D97706',
            lineHeight: 1.55,
            padding: '9px 12px',
            borderRadius: '8px',
            background: 'rgba(245,158,11,0.05)',
            border: '0.5px solid rgba(245,158,11,0.18)',
            marginBottom: '4px',
          }}>
            Estimates only. Figures are for guidance and do not constitute financial or tax advice. Actual deductions may vary based on your individual circumstances.
          </p>

        </div>
      </div>

      {/* ── Right: Results Panel ─────────────────────────────── */}
      <div
        id="calc-results"
        style={{
          background: 'var(--color-bg-base)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >

        {/* Header: period tabs + save button + subtitle */}
        <div style={{
          padding: '14px 20px 0',
          borderBottom: '0.5px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          {/* Top row: tabs (left) + save (right) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '12px',
          }}>
            {/* Period tab bar */}
            <div style={{
              display: 'inline-flex',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '10px',
              padding: '3px',
              gap: '2px',
            }}>
              {RESULT_PERIODS.map(p => {
                const active = p.value === resultPeriod
                return (
                  <button
                    key={p.value}
                    onClick={() => setResultPeriod(p.value)}
                    style={{
                      padding: '5px 14px',
                      borderRadius: '7px',
                      border: 'none',
                      background: active ? 'rgba(77,255,195,0.12)' : 'transparent',
                      color: active ? '#4DFFC3' : 'var(--color-text-muted)',
                      fontFamily: 'var(--font-ui)',
                      fontWeight: active ? 700 : 400,
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                      letterSpacing: '0.01em',
                    }}
                    onMouseEnter={e => {
                      if (!active) e.currentTarget.style.color = 'var(--color-text-primary)'
                    }}
                    onMouseLeave={e => {
                      if (!active) e.currentTarget.style.color = 'var(--color-text-muted)'
                    }}
                  >
                    {p.label}
                  </button>
                )
              })}
            </div>

            {/* Save to dashboard */}
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: '8px',
                border: '0.5px solid rgba(77,255,195,0.22)',
                background: saving ? 'rgba(77,255,195,0.05)' : 'rgba(77,255,195,0.08)',
                color: saving ? 'rgba(77,255,195,0.4)' : '#4DFFC3',
                fontFamily: 'var(--font-ui)',
                fontWeight: 600,
                fontSize: '12px',
                cursor: saving ? 'default' : 'pointer',
                letterSpacing: '0.01em',
                transition: 'all 150ms ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={e => {
                if (!saving) {
                  e.currentTarget.style.background   = 'rgba(77,255,195,0.14)'
                  e.currentTarget.style.borderColor  = 'rgba(77,255,195,0.38)'
                }
              }}
              onMouseLeave={e => {
                if (!saving) {
                  e.currentTarget.style.background   = 'rgba(77,255,195,0.08)'
                  e.currentTarget.style.borderColor  = 'rgba(77,255,195,0.22)'
                }
              }}
            >
              {/* Cloud-upload icon */}
              <svg width='13' height='13' viewBox='0 0 24 24' fill='none'
                stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <polyline points='16 16 12 12 8 16' />
                <line x1='12' y1='12' x2='12' y2='21' />
                <path d='M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3' />
              </svg>
              {saving ? 'Saving…' : 'Save to dashboard'}
            </button>
          </div>

          {/* Subtitle */}
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            marginBottom: '14px',
            letterSpacing: '0.01em',
          }}>
            Based on{' '}
            <span style={{ color: 'var(--color-text-primary)' }}>
              {fmt(gross)} gross
            </span>
            {' · '}Tax code{' '}
            <span style={{ color: 'var(--color-text-primary)' }}>
              {taxCode || '—'}
            </span>
            {INPUT_FREQ_DIVISORS[frequency] !== 1 && (
              <> · <span style={{ color: 'var(--color-text-primary)' }}>{frequency}</span></>
            )}
          </p>
        </div>

        {/* 6-card grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          padding: '18px 20px',
          overflowY: 'auto',
          flex: 1,
          alignContent: 'start',
        }}>
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

        {/* Bottom grid: pay breakdown (left) + tax bands (right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          borderTop: '0.5px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <PayBreakdownCard result={result} rdiv={rdiv} />

          <VisualBreakdownCard result={result} region={region} />
        </div>

      </div>
    </div>

    {/* Saved calculation history */}
    {user && history.length > 0 && (
      <CalcHistoryList history={history} />
    )}
    </>
  )
}

export default SalaryCalculator
