import { useEffect, useRef, useState } from 'react'
import { formatCurrency } from '../../utils/utils'

interface BudgetProps {
  percentage: number
  remaining: number
  color: string
  name: string
  spent: number
  amount: number
}

const Budget = ({ percentage, remaining, color, name, spent }: BudgetProps) => {
  const pct = Math.min(100, Math.max(0, percentage))
  const isOver = remaining < 0

  // Animate bar from 0 → target on mount and whenever pct changes
  const [animPct, setAnimPct] = useState(0)
  const frameRef = useRef<number>(0)
  useEffect(() => {
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => setAnimPct(pct))
    return () => cancelAnimationFrame(frameRef.current)
  }, [pct])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

      {/* Row 1: dot + name + percentage */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: color,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontWeight: 500,
              fontSize: '13px',
              color: 'var(--color-text-primary)',
            }}
          >
            {name}
          </span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: isOver ? 'var(--color-accent-red)' : 'var(--color-text-muted)',
          }}
        >
          {pct.toFixed(0)}%
        </span>
      </div>

      {/* Row 2: 3px progress bar */}
      <div
        style={{
          width: '100%',
          height: '3px',
          borderRadius: '99px',
          background: '#1A2035',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '3px',
            width: `${animPct}%`,
            background: color,
            borderRadius: '99px',
            transition: 'width 0.4s ease-out',
          }}
        />
      </div>

      {/* Row 3: £spent / £remaining */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--color-text-muted)',
          }}
        >
          {formatCurrency(spent)} spent
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: isOver ? 'var(--color-accent-red)' : 'var(--color-text-muted)',
          }}
        >
          {isOver
            ? `${formatCurrency(Math.abs(remaining))} over`
            : `${formatCurrency(remaining)} left`}
        </span>
      </div>

    </div>
  )
}

export default Budget
