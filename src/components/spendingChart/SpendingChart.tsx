import { formatCurrency } from '../../utils/formatters'
import type { Category } from '../../types'
import ChartItem from './ChartItem'

interface SpendingChartProps {
  data: {
    category: Category
    amount: number
    percentage: number
  }[]
}

const SpendingChart = ({ data }: SpendingChartProps) => {
  const total = data.reduce((acc, cur) => acc + cur.amount, 0)

  return (
    <div>
      {/* Header */}
      <div
        style={{
          padding: '20px 20px 16px',
          borderBottom: '0.5px solid rgba(255,255,255,0.06)',
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
          Spending by Category
        </h2>
      </div>

      {/* Body */}
      <div
        style={{
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxHeight: '280px',
          overflowY: 'auto',
        }}
      >
        {data.length === 0 ? (
          <div style={{ padding: '32px 0', textAlign: 'center' }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                color: 'var(--color-text-muted)',
              }}
            >
              No spending this month
            </p>
          </div>
        ) : (
          <>
            {data.map((item, i) => (
              <ChartItem key={item.category.id ?? i} data={item} />
            ))}

            {/* Total */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '0.5px solid rgba(255,255,255,0.06)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 500,
                  fontSize: '13px',
                  color: 'var(--color-text-muted)',
                }}
              >
                Total spending
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: '13px',
                  color: 'var(--color-text-primary)',
                }}
              >
                {formatCurrency(total)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SpendingChart
