import { useEffect, useRef, useState } from 'react'
import { formatCurrency } from '../../utils/utils'
import type { Category } from '../../types'

interface ChartItemProps {
  data: {
    category: Category
    amount: number
    percentage: number
  }
}

const ChartItem = ({ data }: ChartItemProps) => {
  const pct = Math.min(100, Math.max(0, data.percentage))

  const [animPct, setAnimPct] = useState(0)
  const frameRef = useRef<number>(0)
  useEffect(() => {
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => setAnimPct(pct))
    return () => cancelAnimationFrame(frameRef.current)
  }, [pct])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

      {/* Label row */}
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
              background: data.category.color,
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
            {data.category.name}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-text-muted)',
            }}
          >
            {pct.toFixed(0)}%
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '12px',
              color: 'var(--color-text-primary)',
              minWidth: '56px',
              textAlign: 'right',
            }}
          >
            {formatCurrency(data.amount)}
          </span>
        </div>
      </div>

      {/* 3px progress bar */}
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
            background: data.category.color,
            borderRadius: '99px',
            transition: 'width 0.4s ease-out',
          }}
        />
      </div>

    </div>
  )
}

export default ChartItem
