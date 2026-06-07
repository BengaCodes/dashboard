import { ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { formatCurrency } from '../../utils/formatters'
import useCountUp from '../../hooks/common/useCountUp'

const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
]

const CURRENT_YEAR = new Date().getFullYear()
const MIN_YEAR = CURRENT_YEAR - 4
const MAX_YEAR = CURRENT_YEAR

// ── Stat Card ────────────────────────────────────────────────

type StatCardProps = {
  label: string
  value: string
  accent: string
  tint: string
  icon: LucideIcon
}

const StatCard = ({ label, value, accent, tint, icon: Icon }: StatCardProps) => (
  <div
    style={{
      background: '#111626',
      border: '0.5px solid rgba(255,255,255,0.06)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}
  >
    <div style={{ height: '2px', background: accent }} />

    <div
      style={{
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '12px',
      }}
    >
      <div>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 400,
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--color-text-muted)',
            marginBottom: '10px',
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 700,
            fontSize: '26px',
            letterSpacing: '-0.5px',
            color: accent,
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {value}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: tint,
          flexShrink: 0,
        }}
      >
        <Icon size={18} color={accent} />
      </div>
    </div>
  </div>
)

// ── Arrow Button ─────────────────────────────────────────────

const ArrowBtn = ({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void
  disabled: boolean
  label: string
  children: React.ReactNode
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      border: '0.5px solid rgba(255,255,255,0.08)',
      background: 'var(--color-bg-surface)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.3 : 1,
      color: 'var(--color-text-primary)',
      transition: 'background 150ms ease, transform 150ms ease',
      flexShrink: 0,
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        const el = e.currentTarget as HTMLButtonElement
        el.style.background = 'rgba(255,255,255,0.06)'
        el.style.transform = 'scale(1.05)'
      }
    }}
    onMouseLeave={(e) => {
      const el = e.currentTarget as HTMLButtonElement
      el.style.background = 'var(--color-bg-surface)'
      el.style.transform = 'scale(1)'
    }}
  >
    {children}
  </button>
)

// ── Hero Section ─────────────────────────────────────────────

type HeroSectionProps = {
  selectedDate: Date
  onChangeDate: (date: Date) => void
  income: number
  expenses: number
  balance: number
}

const HeroSection = ({
  selectedDate,
  onChangeDate,
  income,
  expenses,
  balance,
}: HeroSectionProps) => {
  const month = selectedDate.getMonth()
  const year = selectedDate.getFullYear()
  const isFirst = month === 0 && year <= MIN_YEAR
  const isLast  = month === 11 && year >= MAX_YEAR

  // Slide animation state — keyed remount triggers fresh slide + count-up
  const [animKey, setAnimKey] = useState(0)
  const [slideDir, setSlideDir] = useState<'right' | 'left'>('right')

  // Count-up for stat cards (re-runs when income/expenses change)
  const animIncome   = useCountUp(income)
  const animExpenses = useCountUp(expenses)

  const move = (dir: 'prev' | 'next') => {
    setSlideDir(dir === 'next' ? 'right' : 'left')
    setAnimKey((k) => k + 1)
    const d = new Date(selectedDate)
    d.setMonth(d.getMonth() + (dir === 'next' ? 1 : -1))
    onChangeDate(d)
  }

  const slideAnim = slideDir === 'right' ? 'slideInFromRight' : 'slideInFromLeft'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Period selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ArrowBtn onClick={() => move('prev')} disabled={isFirst} label="Previous month">
          <ChevronLeft size={15} />
        </ArrowBtn>

        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 500,
            fontSize: '13px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-text-primary)',
            minWidth: '128px',
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          {MONTHS[month]} {year}
        </span>

        <ArrowBtn onClick={() => move('next')} disabled={isLast} label="Next month">
          <ChevronRight size={15} />
        </ArrowBtn>
      </div>

      {/* Balance hero — slides in on each navigation */}
      <div
        key={animKey}
        style={{
          animation: `${slideAnim} 200ms ease both`,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 400,
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--color-text-muted)',
            marginBottom: '8px',
          }}
        >
          Net Balance
        </p>
        <BalanceDisplay balance={balance} />
      </div>

      {/* Stat cards — Income & Expenses */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
        }}
      >
        <StatCard
          label="Income"
          value={formatCurrency(animIncome)}
          accent="#4DFFC3"
          tint="rgba(77,255,195,0.10)"
          icon={TrendingUp}
        />
        <StatCard
          label="Expenses"
          value={formatCurrency(animExpenses)}
          accent="#FF4E7A"
          tint="rgba(255,78,122,0.10)"
          icon={TrendingDown}
        />
      </div>

    </div>
  )
}

// ── Balance Display ──────────────────────────────────────────
// Isolated so useCountUp restarts cleanly when the parent remounts it via key.

const BalanceDisplay = ({ balance }: { balance: number }) => {
  const animated = useCountUp(balance)
  return (
    <p
      style={{
        fontFamily: 'var(--font-ui)',
        fontWeight: 700,
        fontSize: '48px',
        letterSpacing: '-2px',
        color: 'var(--color-text-primary)',
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {formatCurrency(animated)}
    </p>
  )
}

export default HeroSection
