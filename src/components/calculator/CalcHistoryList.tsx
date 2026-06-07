import type { TransactionWithCategory } from '../../types'
import { fmtGBP } from '../../utils/taxCalculator'

const CalcHistoryList = ({ history }: { history: TransactionWithCategory[] }) => (
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
        Saved recurring income
      </span>
    </div>
    {history.map((tx, i) => (
      <div
        key={tx.id}
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
          {new Date(tx.date).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px',
          color: 'var(--color-text-primary)',
          maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {tx.description}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#4DFFC3' }}>
          {fmtGBP(tx.amount, 2)} / mo
        </span>
      </div>
    ))}
  </div>
)

export default CalcHistoryList
