import { useState, Suspense } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useAuth } from '../../state/useAuth'
import { budgetQueries } from '../../utils/dataQuery'
import { formatCurrency } from '../../utils/formatters'
import { Icon } from '../common/Icons'
import Modal from '../modal/Modal'
import AddBudgetForm from '../budgetOverview/AddBudgetForm'
import type { BudgetWithCategory } from '../../types'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const CURRENT_YEAR = new Date().getFullYear()
const MIN_YEAR     = CURRENT_YEAR - 4
const MAX_YEAR     = CURRENT_YEAR

// ── Status helper ────────────────────────────────────────────

function statusFor(pct: number) {
  if (pct >= 100) return { accent: '#FF4E7A', tint: 'rgba(255,78,122,0.09)',  label: 'Over budget' }
  if (pct >= 90)  return { accent: '#FF4E7A', tint: 'rgba(255,78,122,0.09)',  label: 'Critical'    }
  if (pct >= 70)  return { accent: '#FFB547', tint: 'rgba(255,181,71,0.09)', label: 'Near limit'  }
  return              { accent: '#4DFFC3', tint: 'rgba(77,255,195,0.09)',  label: 'On track'    }
}

// ── Arrow button ─────────────────────────────────────────────

const ArrowBtn = ({ onClick, disabled, label, children }: {
  onClick: () => void; disabled: boolean; label: string; children: React.ReactNode
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: '30px', height: '30px', borderRadius: '8px',
      border: '0.5px solid rgba(255,255,255,0.08)',
      background: 'var(--color-bg-surface)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.3 : 1,
      color: 'var(--color-text-primary)',
      transition: 'background 150ms cubic-bezier(0.32,0.72,0,1), transform 150ms cubic-bezier(0.32,0.72,0,1)',
      flexShrink: 0,
    }}
    onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'scale(1.08)' } }}
    onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-bg-surface)'; e.currentTarget.style.transform = 'scale(1)' }}
  >
    {children}
  </button>
)

// ── Animated progress bar ────────────────────────────────────

const Bar = ({ pct, color }: { pct: number; color: string }) => (
  <div style={{ height: '5px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
    <div style={{
      height: '5px',
      width: `${Math.min(pct, 100)}%`,
      background: color,
      borderRadius: '99px',
      boxShadow: `0 0 10px ${color}50`,
      transition: 'width 0.65s cubic-bezier(0.32,0.72,0,1)',
    }} />
  </div>
)

// ── Budget card ───────────────────────────────────────────────

const BudgetCard = ({ budget, index }: { budget: BudgetWithCategory; index: number }) => {
  const pct    = budget.amount > 0 ? (Number(budget.spent) / Number(budget.amount)) * 100 : 0
  const status = statusFor(pct)
  const isOver = Number(budget.spent) > Number(budget.amount)
  const delta  = Math.abs(Number(budget.amount) - Number(budget.spent))
  const cat    = budget.categories

  return (
    <div
      style={{
        background: 'var(--color-bg-surface)',
        border: '0.5px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        animation: 'rowFadeIn 350ms ease both',
        animationDelay: `${Math.min(index, 9) * 55}ms`,
        transition: 'border-color 200ms cubic-bezier(0.32,0.72,0,1), box-shadow 200ms cubic-bezier(0.32,0.72,0,1), transform 200ms cubic-bezier(0.32,0.72,0,1)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'rgba(255,255,255,0.14)'
        el.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'
        el.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'rgba(255,255,255,0.07)'
        el.style.boxShadow = 'none'
        el.style.transform = 'translateY(0)'
      }}
    >
      {/* Category-colour top bar */}
      <div style={{ height: '2px', background: cat?.color ?? status.accent }} />

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px', flex: 1 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
              background: `${cat?.color ?? status.accent}1a`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon iconName={cat?.icon ?? 'Wallet'} size={15} style={{ color: cat?.color ?? status.accent }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '14px',
                color: 'var(--color-text-primary)', lineHeight: 1.2,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {cat?.name ?? 'Uncategorised'}
              </p>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                color: 'var(--color-text-muted)', marginTop: '2px', textTransform: 'capitalize',
              }}>
                {budget.period?.toLowerCase() ?? 'monthly'}
              </p>
            </div>
          </div>

          {/* Status chip */}
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            textTransform: 'uppercase', letterSpacing: '0.07em',
            color: status.accent,
            background: status.tint,
            border: `0.5px solid ${status.accent}45`,
            borderRadius: '6px',
            padding: '3px 8px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {status.label}
          </span>
        </div>

        {/* Spend amount */}
        <div>
          <p style={{
            fontFamily: 'var(--font-ui)', fontWeight: 700,
            fontSize: '26px', letterSpacing: '-0.5px',
            color: 'var(--color-text-primary)', lineHeight: 1,
          }}>
            {formatCurrency(Number(budget.spent))}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            of {formatCurrency(Number(budget.amount))} budget
          </p>
        </div>

        {/* Progress */}
        <Bar pct={pct} color={status.accent} />

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
            {pct.toFixed(0)}% used
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: isOver ? 600 : 400,
            color: isOver ? '#FF4E7A' : 'var(--color-text-muted)',
          }}>
            {isOver ? `${formatCurrency(delta)} over` : `${formatCurrency(delta)} remaining`}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Summary stat tile ─────────────────────────────────────────

const StatTile = ({ label, value, accent, sub }: {
  label: string; value: string; accent: string; sub?: string
}) => (
  <div style={{
    background: 'var(--color-bg-surface)',
    border: '0.5px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '16px 20px',
    display: 'flex', flexDirection: 'column', gap: '4px',
  }}>
    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)' }}>
      {label}
    </p>
    <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '20px', letterSpacing: '-0.4px', color: accent, lineHeight: 1 }}>
      {value}
    </p>
    {sub && (
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)' }}>
        {sub}
      </p>
    )}
  </div>
)

// ── Card skeleton (dark-theme) ────────────────────────────────

const CardSkeleton = () => (
  <div style={{
    background: 'var(--color-bg-surface)',
    border: '0.5px solid rgba(255,255,255,0.06)',
    borderRadius: '16px', overflow: 'hidden',
  }}>
    <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)' }} />
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ height: '12px', width: '60%', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
          <div style={{ height: '9px', width: '35%', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', animation: 'shimmer 1.5s ease-in-out infinite', animationDelay: '100ms' }} />
        </div>
      </div>
      <div style={{ height: '26px', width: '55%', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', animation: 'shimmer 1.5s ease-in-out infinite', animationDelay: '50ms' }} />
      <div style={{ height: '5px', borderRadius: '99px', background: 'rgba(255,255,255,0.05)', animation: 'shimmer 1.5s ease-in-out infinite', animationDelay: '120ms' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ height: '9px', width: '28%', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', animation: 'shimmer 1.5s ease-in-out infinite', animationDelay: '80ms' }} />
        <div style={{ height: '9px', width: '32%', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', animation: 'shimmer 1.5s ease-in-out infinite', animationDelay: '150ms' }} />
      </div>
    </div>
  </div>
)

// ── Inner (inside Suspense) ───────────────────────────────────

const BudgetsInner = ({ selectedDate, onOpenModal }: {
  selectedDate: Date
  onOpenModal: () => void
}) => {
  const { user } = useAuth()

  const { data: budgets = [] } = useSuspenseQuery<BudgetWithCategory[]>({
    queryKey: user
      ? budgetQueries.withSpentBudgets(user.id, String(selectedDate.getMonth()))
      : ['budgets-no-user'],
    queryFn: () => budgetQueries.getBudgetWithSpent(selectedDate),
  })

  const totalBudget    = budgets.reduce((s, b) => s + Number(b.amount), 0)
  const totalSpent     = budgets.reduce((s, b) => s + Number(b.spent),  0)
  const totalRemaining = Math.max(0, totalBudget - totalSpent)
  const utilPct        = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
  const overallStatus  = statusFor(utilPct)

  if (budgets.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '380px', gap: '18px',
        background: 'var(--color-bg-surface)',
        border: '0.5px solid rgba(255,255,255,0.06)',
        borderRadius: '16px', textAlign: 'center',
      }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '16px',
          background: 'rgba(77,255,195,0.07)',
          border: '0.5px solid rgba(77,255,195,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Plus size={22} color='#4DFFC3' />
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
            No budgets for this period
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Set spending limits by category to stay on track
          </p>
        </div>
        <button
          onClick={onOpenModal}
          style={{
            padding: '10px 24px', borderRadius: '10px',
            border: 'none', background: '#4DFFC3', color: '#0B0F1A',
            fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '13px',
            cursor: 'pointer',
            transition: 'opacity 150ms cubic-bezier(0.32,0.72,0,1), transform 150ms cubic-bezier(0.32,0.72,0,1)',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.04)' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
        >
          Add your first budget
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Summary strip */}
      <div className='budgets-summary-grid' style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
      }}>
        <StatTile label='Total Budget'  value={formatCurrency(totalBudget)}    accent='var(--color-text-primary)'  />
        <StatTile label='Total Spent'   value={formatCurrency(totalSpent)}     accent='#FF4E7A'                    />
        <StatTile label='Remaining'     value={formatCurrency(totalRemaining)} accent='#4DFFC3'                    />
        <StatTile
          label='Utilization'
          value={`${utilPct.toFixed(0)}%`}
          accent={overallStatus.accent}
          sub={overallStatus.label}
        />
      </div>

      {/* Cards grid */}
      <div className='budgets-grid' style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
      }}>
        {budgets.map((b, i) => <BudgetCard key={b.id} budget={b} index={i} />)}
      </div>
    </>
  )
}

// ── Skeleton fallback ─────────────────────────────────────────

const BudgetsSkeleton = () => (
  <>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
      {[0,1,2,3].map(i => (
        <div key={i} style={{ background: 'var(--color-bg-surface)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px 20px', height: '72px', animation: 'shimmer 1.5s ease-in-out infinite', animationDelay: `${i * 80}ms` }} />
      ))}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      {[0,1,2,3,4,5].map(i => <CardSkeleton key={i} />)}
    </div>
  </>
)

// ── Page ─────────────────────────────────────────────────────

const BudgetsPage = () => {
  const [selectedDate, setSelectedDate] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth())
  )
  const [openModal, setOpenModal] = useState(false)

  const month   = selectedDate.getMonth()
  const year    = selectedDate.getFullYear()
  const isFirst = month === 0 && year <= MIN_YEAR
  const isLast  = month === 11 && year >= MAX_YEAR

  const move = (dir: 'prev' | 'next') => {
    const d = new Date(selectedDate)
    d.setMonth(d.getMonth() + (dir === 'next' ? 1 : -1))
    setSelectedDate(d)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {/* Title */}
          <div>
            <h1 style={{
              fontFamily: 'var(--font-ui)', fontWeight: 700,
              fontSize: '22px', letterSpacing: '-0.5px',
              color: 'var(--color-text-primary)', lineHeight: 1, marginBottom: '4px',
            }}>
              Budgets
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
              Monthly spending limits by category
            </p>
          </div>

          {/* Month navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowBtn onClick={() => move('prev')} disabled={isFirst} label='Previous month'>
              <ChevronLeft size={13} />
            </ArrowBtn>
            <span style={{
              fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: '12px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--color-text-primary)', minWidth: '112px',
              textAlign: 'center', userSelect: 'none',
            }}>
              {MONTHS[month]} {year}
            </span>
            <ArrowBtn onClick={() => move('next')} disabled={isLast} label='Next month'>
              <ChevronRight size={13} />
            </ArrowBtn>
          </div>
        </div>

        {/* Add Budget CTA */}
        <button
          onClick={() => setOpenModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '0 16px', height: '36px', borderRadius: '10px',
            border: 'none', background: '#4DFFC3', color: '#0B0F1A',
            fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '13px',
            cursor: 'pointer', flexShrink: 0,
            transition: 'opacity 150ms cubic-bezier(0.32,0.72,0,1), transform 150ms cubic-bezier(0.32,0.72,0,1)',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.04)' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
        >
          <Plus size={14} />
          Add Budget
        </button>
      </div>

      {/* Content */}
      <Suspense fallback={<BudgetsSkeleton />}>
        <BudgetsInner selectedDate={selectedDate} onOpenModal={() => setOpenModal(true)} />
      </Suspense>

      <Modal title='Add Budget' isOpen={openModal} onClose={() => setOpenModal(false)}>
        <AddBudgetForm handleModalClose={() => setOpenModal(false)} />
      </Modal>
    </div>
  )
}

export default BudgetsPage
