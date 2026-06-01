import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { BudgetWithCategory } from '../../types'
import { formatCurrency, getPercentage } from '../../utils/utils'
import Budget from './Budget'
import Modal from '../modal/Modal'
import AddBudgetForm from './AddBudgetForm'

// ── Donut Chart ──────────────────────────────────────────────

const RADIUS = 45
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const DonutChart = ({ percentage }: { percentage: number }) => {
  const pct = Math.min(100, Math.max(0, percentage))
  const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE

  return (
    <svg
      width='120'
      height='120'
      viewBox='0 0 120 120'
      style={{ display: 'block' }}
      aria-label={`${pct.toFixed(0)}% of budget used`}
      role='img'
    >
      {/* Dark track */}
      <circle
        cx='60'
        cy='60'
        r={RADIUS}
        fill='none'
        stroke='#1A2035'
        strokeWidth='10'
      />
      {/* Teal fill arc */}
      <circle
        cx='60'
        cy='60'
        r={RADIUS}
        fill='none'
        stroke='#4DFFC3'
        strokeWidth='10'
        strokeLinecap='round'
        strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
        strokeDashoffset={offset}
        transform='rotate(-90 60 60)'
        style={{ transition: 'stroke-dashoffset 600ms ease' }}
      />
      {/* Percentage label */}
      <text
        x='60'
        y='60'
        textAnchor='middle'
        dominantBaseline='central'
        style={{
          fontFamily: "'DM Mono', monospace",
          fontWeight: 700,
          fontSize: '16px',
          fill: '#F0EFE8',
        }}
      >
        {pct.toFixed(0)}%
      </text>
    </svg>
  )
}

// ── Budget Overview ──────────────────────────────────────────

const BudgetOverview = ({ budgets }: { budgets: BudgetWithCategory[] }) => {
  const [openModal, setOpenModal] = useState(false)

  const totalLimit = budgets.reduce((s, b) => s + Number(b.amount), 0)
  const totalSpent = budgets.reduce((s, b) => s + Number(b.spent), 0)
  const totalRemaining = totalLimit - totalSpent
  const overallPct = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0

  return (
    <>
      {/* ── Header ──────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 20px 16px',
          borderTop: '0.5px solid rgba(255,255,255,0.06)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            fontSize: '15px',
            color: 'var(--color-text-primary)',
          }}
        >
          Budget Overview
        </h2>

        <button
          onClick={() => setOpenModal(true)}
          aria-label='Add budget'
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            padding: '0 10px',
            height: '28px',
            borderRadius: '8px',
            border: 'none',
            background: '#4DFFC3',
            cursor: 'pointer',
            color: '#0B0F1A',
            fontFamily: 'var(--font-ui)',
            fontWeight: 700,
            fontSize: '12px',
            transition: 'opacity 150ms ease, transform 150ms ease',
            transform: 'scale(1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9'
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <Plus size={12} />
          Add
        </button>
      </div>

      {/* ── Body ────────────────────────────────────────── */}
      <div
        style={{
          padding: '0 20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Summary card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '0.5px solid rgba(255,255,255,0.06)',
            borderRadius: '10px',
            padding: '14px 16px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--color-text-muted)',
              marginBottom: '6px',
            }}
          >
            Monthly Limit
          </p>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontWeight: 700,
              fontSize: '30px',
              letterSpacing: '-0.5px',
              color: 'var(--color-text-primary)',
              lineHeight: 1,
              marginBottom: '8px',
            }}
          >
            {formatCurrency(totalLimit)}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-text-muted)',
            }}
          >
            {formatCurrency(totalSpent)} spent
            <span style={{ margin: '0 6px', opacity: 0.3 }}>·</span>
            {formatCurrency(Math.max(0, totalRemaining))} remaining
          </p>
        </div>

        {/* Donut chart */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <DonutChart percentage={overallPct} />
        </div>

        {/* Category list */}
        {budgets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--color-text-muted)',
              }}
            >
              No budgets set
            </p>
            <button
              onClick={() => setOpenModal(true)}
              style={{
                marginTop: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--color-accent-green)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Add your first budget →
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              borderTop: '0.5px solid rgba(255,255,255,0.06)',
              paddingTop: '20px',
              maxHeight: '340px',
              overflowY: 'auto',
            }}
          >
            {budgets.map((budget) => (
              <Budget
                key={budget.id}
                name={budget.categories?.name}
                percentage={getPercentage(budget.spent, budget.amount)}
                remaining={budget.amount - budget.spent}
                color={budget.categories?.color}
                amount={budget.amount}
                spent={budget.spent}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        title='Add Budget'
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      >
        <AddBudgetForm handleModalClose={() => setOpenModal(false)} />
      </Modal>
    </>
  )
}

export default BudgetOverview
