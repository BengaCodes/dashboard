import { useState, useMemo, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { formatCurrency } from '../../utils/utils'
import { transactionQueries, categoryQueries } from '../../utils/dataQuery'
import type { TransactionWithCategory, Category } from '../../types'

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const CURRENT_YEAR = new Date().getFullYear()

// ── Data helpers ─────────────────────────────────────────────

function monthlyTotals(txs: TransactionWithCategory[], year: number) {
  return Array.from({ length: 12 }, (_, m) => {
    const slice = txs.filter(t => {
      const d = new Date(t.date)
      return d.getFullYear() === year && d.getMonth() === m
    })
    const income   = slice.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
    const expenses = slice.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
    return { month: m, income, expenses }
  })
}

function categoryTotals(txs: TransactionWithCategory[], cats: Category[], year: number) {
  const expenseTxs = txs.filter(t => {
    const d = new Date(t.date)
    return t.type === 'expense' && d.getFullYear() === year
  })
  const total = expenseTxs.reduce((s, t) => s + Number(t.amount), 0)
  return cats
    .filter(c => c.type === 'expense')
    .map(cat => ({
      cat,
      amount: expenseTxs.filter(t => t.category_id === cat.id).reduce((s, t) => s + Number(t.amount), 0),
    }))
    .filter(x => x.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .map(x => ({ ...x, pct: total > 0 ? (x.amount / total) * 100 : 0 }))
}

// ── Arrow button ─────────────────────────────────────────────

const ArrowBtn = ({ onClick, disabled, label, children }: {
  onClick: () => void; disabled: boolean; label: string; children: React.ReactNode
}) => (
  <button
    onClick={onClick} disabled={disabled} aria-label={label}
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: '30px', height: '30px', borderRadius: '8px',
      border: '0.5px solid rgba(255,255,255,0.08)',
      background: 'var(--color-bg-surface)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.3 : 1, color: 'var(--color-text-primary)',
      transition: 'background 150ms ease, transform 150ms ease', flexShrink: 0,
    }}
    onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'scale(1.08)' } }}
    onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-bg-surface)'; e.currentTarget.style.transform = 'scale(1)' }}
  >
    {children}
  </button>
)

// ── Monthly bar chart ─────────────────────────────────────────
// SVG viewBox 900×300, bars scale via transform from bottom.

const BAR_H      = 200
const BAR_PAD_L  = 70
const BAR_PAD_B  = 38
const BAR_PAD_T  = 16
const BAR_PAD_R  = 16
const VB_W       = 900

const BarChart = ({ data }: { data: { month: number; income: number; expenses: number }[] }) => {
  const [ready, setReady] = useState(false)
  const idRef = useRef<number>(0)
  useEffect(() => {
    setReady(false)
    idRef.current = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(idRef.current)
  }, [data])

  const maxVal  = Math.max(...data.flatMap(d => [d.income, d.expenses]), 1)
  const niceMax = Math.ceil(maxVal / 500) * 500 || 500
  const chartH  = BAR_H - BAR_PAD_T - BAR_PAD_B
  const chartW  = VB_W - BAR_PAD_L - BAR_PAD_R
  const slotW   = chartW / 12
  const bw      = slotW * 0.28

  const yFmt = (v: number) => {
    if (v >= 1000) return `£${(v / 1000).toFixed(0)}k`
    return `£${v}`
  }
  const yTicks = [0, 0.25, 0.5, 0.75, 1]

  return (
    <svg viewBox={`0 0 ${VB_W} ${BAR_H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* Grid lines + Y labels */}
      {yTicks.map(t => {
        const y = BAR_PAD_T + chartH * (1 - t)
        return (
          <g key={t}>
            <line x1={BAR_PAD_L} y1={y} x2={VB_W - BAR_PAD_R} y2={y}
              stroke='rgba(255,255,255,0.05)' strokeWidth={1} />
            <text x={BAR_PAD_L - 8} y={y + 3} textAnchor='end'
              fill='rgba(255,255,255,0.25)'
              style={{ fontFamily: "'DM Mono',monospace", fontSize: 9 }}>
              {yFmt(niceMax * t)}
            </text>
          </g>
        )
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const cx      = BAR_PAD_L + slotW * i + slotW / 2
        const gap     = bw * 0.25
        const incH    = ready ? (d.income   / niceMax) * chartH : 0
        const expH    = ready ? (d.expenses / niceMax) * chartH : 0
        const baseY   = BAR_PAD_T + chartH
        const delay   = `${i * 40}ms`

        return (
          <g key={i}>
            {/* Income bar */}
            <rect
              x={cx - bw - gap / 2} y={baseY - incH}
              width={bw} height={incH} rx={2}
              fill='#4DFFC3' fillOpacity={0.85}
              style={{
                transformBox: 'fill-box', transformOrigin: 'center bottom',
                transform: ready ? 'scaleY(1)' : 'scaleY(0)',
                transition: `transform 0.55s cubic-bezier(0.32,0.72,0,1) ${delay}`,
              }}
            />
            {/* Expense bar */}
            <rect
              x={cx + gap / 2} y={baseY - expH}
              width={bw} height={expH} rx={2}
              fill='#FF4E7A' fillOpacity={0.85}
              style={{
                transformBox: 'fill-box', transformOrigin: 'center bottom',
                transform: ready ? 'scaleY(1)' : 'scaleY(0)',
                transition: `transform 0.55s cubic-bezier(0.32,0.72,0,1) ${delay}`,
              }}
            />
            {/* Month label */}
            <text x={cx} y={BAR_PAD_T + chartH + 20} textAnchor='middle'
              fill='rgba(255,255,255,0.28)'
              style={{ fontFamily: "'DM Mono',monospace", fontSize: 9 }}>
              {MONTHS_SHORT[d.month]}
            </text>
          </g>
        )
      })}

      {/* X axis */}
      <line x1={BAR_PAD_L} y1={BAR_PAD_T + chartH}
        x2={VB_W - BAR_PAD_R} y2={BAR_PAD_T + chartH}
        stroke='rgba(255,255,255,0.08)' strokeWidth={1} />
    </svg>
  )
}

// ── Donut chart ───────────────────────────────────────────────
// Multiple stroked circles, one per segment.

const DONUT_R  = 72
const DONUT_CX = 96
const DONUT_CY = 96
const SW       = 22
const CIRC     = 2 * Math.PI * DONUT_R

type CatSegment = { cat: Category; amount: number; pct: number }

const DonutChart = ({ segments }: { segments: CatSegment[] }) => {
  const [ready, setReady] = useState(false)
  const idRef = useRef<number>(0)
  useEffect(() => {
    setReady(false)
    idRef.current = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(idRef.current)
  }, [segments])

  let offset = 0
  const arcs = segments.map((s, i) => {
    const len   = (s.pct / 100) * CIRC
    const arc   = { ...s, dashOffset: -offset, dashLen: len, idx: i }
    offset += len + (i < segments.length - 1 ? 1.5 : 0) // 1.5px gap between segments
    return arc
  })

  const totalExpenses = segments.reduce((s, x) => s + x.amount, 0)

  return (
    <svg viewBox={`0 0 ${DONUT_CX * 2} ${DONUT_CY * 2}`} style={{ width: '192px', height: '192px', flexShrink: 0 }}>
      {/* Track */}
      <circle cx={DONUT_CX} cy={DONUT_CY} r={DONUT_R}
        fill='none' stroke='rgba(255,255,255,0.05)' strokeWidth={SW} />

      {/* Segments */}
      {arcs.map(arc => (
        <circle
          key={arc.cat.id}
          cx={DONUT_CX} cy={DONUT_CY} r={DONUT_R}
          fill='none'
          stroke={arc.cat.color}
          strokeWidth={SW}
          strokeLinecap='butt'
          strokeDasharray={`${ready ? arc.dashLen : 0} ${CIRC}`}
          strokeDashoffset={arc.dashOffset}
          transform={`rotate(-90 ${DONUT_CX} ${DONUT_CY})`}
          style={{ transition: `stroke-dasharray 0.7s cubic-bezier(0.32,0.72,0,1) ${arc.idx * 60}ms` }}
        />
      ))}

      {/* Centre label */}
      <text x={DONUT_CX} y={DONUT_CY - 6} textAnchor='middle'
        fill='rgba(255,255,255,0.35)'
        style={{ fontFamily: "'DM Mono',monospace", fontSize: 8 }}>
        Total spend
      </text>
      <text x={DONUT_CX} y={DONUT_CY + 10} textAnchor='middle'
        fill='#F0EFE8'
        style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 13 }}>
        {formatCurrency(totalExpenses)}
      </text>
    </svg>
  )
}

// ── Summary tile ─────────────────────────────────────────────

const Tile = ({ label, value, accent }: { label: string; value: string; accent: string }) => (
  <div style={{
    background: 'var(--color-bg-surface)',
    border: '0.5px solid rgba(255,255,255,0.06)',
    borderRadius: '12px', padding: '16px 20px',
    display: 'flex', flexDirection: 'column', gap: '5px',
  }}>
    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)' }}>
      {label}
    </p>
    <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '20px', letterSpacing: '-0.4px', color: accent, lineHeight: 1 }}>
      {value}
    </p>
  </div>
)

// ── Page ─────────────────────────────────────────────────────

type ViewMode = 'monthly' | 'category'

const AnalyticsPage = () => {
  const [year,     setYear]     = useState(CURRENT_YEAR)
  const [viewMode, setViewMode] = useState<ViewMode>('monthly')

  const { data: txs  = [] } = useQuery<TransactionWithCategory[]>({
    queryKey: transactionQueries.all(),
    queryFn:  transactionQueries.getTransactions,
  })

  const { data: cats = [] } = useQuery<Category[]>({
    queryKey: categoryQueries.all(),
    queryFn:  categoryQueries.getCategories,
  })

  const monthly  = useMemo(() => monthlyTotals(txs, year), [txs, year])
  const catData  = useMemo(() => categoryTotals(txs, cats, year), [txs, cats, year])

  const yearIncome   = monthly.reduce((s, m) => s + m.income,   0)
  const yearExpenses = monthly.reduce((s, m) => s + m.expenses, 0)
  const yearNet      = yearIncome - yearExpenses
  const savingsRate  = yearIncome > 0 ? (yearNet / yearIncome) * 100 : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '22px', letterSpacing: '-0.5px', color: 'var(--color-text-primary)', lineHeight: 1, marginBottom: '4px' }}>
              Analytics
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
              Spending breakdown and trends
            </p>
          </div>

          {/* Year navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowBtn onClick={() => setYear(y => y - 1)} disabled={year <= CURRENT_YEAR - 4} label='Previous year'>
              <ChevronLeft size={13} />
            </ArrowBtn>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: '12px', color: 'var(--color-text-primary)', minWidth: '44px', textAlign: 'center', userSelect: 'none' }}>
              {year}
            </span>
            <ArrowBtn onClick={() => setYear(y => y + 1)} disabled={year >= CURRENT_YEAR} label='Next year'>
              <ChevronRight size={13} />
            </ArrowBtn>
          </div>
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '3px', gap: '2px' }}>
          {([['monthly', 'Monthly'] , ['category', 'By Category']] as [ViewMode, string][]).map(([v, label]) => {
            const active = viewMode === v
            return (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                style={{
                  padding: '6px 16px', borderRadius: '8px', border: 'none',
                  background: active ? 'rgba(77,255,195,0.12)' : 'transparent',
                  color: active ? '#4DFFC3' : 'var(--color-text-muted)',
                  fontFamily: 'var(--font-ui)', fontWeight: active ? 600 : 400, fontSize: '12px',
                  cursor: 'pointer', transition: 'all 150ms ease',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--color-text-primary)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--color-text-muted)' }}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Summary strip ───────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }} className='analytics-summary'>
        <Tile label='Total Income'   value={formatCurrency(yearIncome)}   accent='#4DFFC3' />
        <Tile label='Total Expenses' value={formatCurrency(yearExpenses)} accent='#FF4E7A' />
        <Tile label='Net Balance'    value={formatCurrency(yearNet)}      accent={yearNet >= 0 ? 'var(--color-text-primary)' : '#FF4E7A'} />
        <Tile label='Savings Rate'   value={`${savingsRate.toFixed(1)}%`} accent={savingsRate >= 20 ? '#4DFFC3' : savingsRate >= 0 ? '#FFB547' : '#FF4E7A'} />
      </div>

      {/* ── Chart panel ─────────────────────────────────────── */}
      <div style={{
        background: 'var(--color-bg-surface)',
        border: '0.5px solid rgba(255,255,255,0.06)',
        borderRadius: '16px', overflow: 'hidden',
      }}>

        {/* Panel header */}
        <div style={{ padding: '16px 22px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '99px', background: '#4DFFC3', boxShadow: '0 0 6px #4DFFC360' }} />
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)' }}>
            {viewMode === 'monthly' ? `Income vs Expenses — ${year}` : `Spending by Category — ${year}`}
          </p>
        </div>

        {/* ── Monthly bar chart ───────── */}
        {viewMode === 'monthly' && (
          <div style={{ padding: '24px 20px 16px' }}>
            {/* Legend */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', justifyContent: 'flex-end' }}>
              {[['#4DFFC3', 'Income'], ['#FF4E7A', 'Expenses']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: c }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</span>
                </div>
              ))}
            </div>
            <BarChart data={monthly} />

            {/* Monthly totals table */}
            <div style={{ marginTop: '24px', borderTop: '0.5px solid rgba(255,255,255,0.06)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '0' }}>
              {monthly.filter(m => m.income > 0 || m.expenses > 0).map((m, i) => {
                const net = m.income - m.expenses
                return (
                  <div
                    key={m.month}
                    style={{
                      display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr',
                      gap: '12px', padding: '10px 4px', alignItems: 'center',
                      borderTop: i > 0 ? '0.5px solid rgba(255,255,255,0.04)' : 'none',
                      animation: 'rowFadeIn 250ms ease both',
                      animationDelay: `${i * 30}ms`,
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      {MONTHS_SHORT[m.month]}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#4DFFC3' }}>
                      +{formatCurrency(m.income)}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#FF4E7A' }}>
                      -{formatCurrency(m.expenses)}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: net >= 0 ? 'var(--color-text-primary)' : '#FF4E7A', textAlign: 'right' }}>
                      {net >= 0 ? '+' : ''}{formatCurrency(net)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Category donut view ─────── */}
        {viewMode === 'category' && (
          <div style={{ padding: '28px 24px' }}>
            {catData.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '220px', gap: '10px' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  No expense data for {year}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Donut */}
                <DonutChart segments={catData} />

                {/* Legend table */}
                <div style={{ flex: 1, minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {catData.map((s, i) => (
                    <div
                      key={s.cat.id}
                      style={{
                        display: 'grid', gridTemplateColumns: '28px 1fr 72px 52px',
                        gap: '10px', alignItems: 'center',
                        padding: '10px 4px',
                        borderBottom: i < catData.length - 1 ? '0.5px solid rgba(255,255,255,0.05)' : 'none',
                        animation: 'rowFadeIn 300ms ease both',
                        animationDelay: `${i * 45}ms`,
                      }}
                    >
                      {/* Colour dot */}
                      <div style={{ width: '10px', height: '10px', borderRadius: '99px', background: s.cat.color, boxShadow: `0 0 6px ${s.cat.color}60`, margin: 'auto' }} />
                      {/* Name */}
                      <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '13px', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.cat.name}
                      </span>
                      {/* Amount */}
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-primary)', textAlign: 'right' }}>
                        {formatCurrency(s.amount)}
                      </span>
                      {/* Pct badge */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: '10px',
                          color: s.cat.color, background: `${s.cat.color}15`,
                          border: `0.5px solid ${s.cat.color}40`,
                          borderRadius: '5px', padding: '2px 7px',
                        }}>
                          {s.pct.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Total row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 72px 52px', gap: '10px', alignItems: 'center', padding: '12px 4px', borderTop: '0.5px solid rgba(255,255,255,0.1)', marginTop: '4px' }}>
                    <div />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>Total</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: '#FF4E7A', textAlign: 'right' }}>
                      {formatCurrency(catData.reduce((s, x) => s + x.amount, 0))}
                    </span>
                    <div />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyticsPage
