import type { CalcResult } from '../../utils/taxCalculator'
import { fmtGBP } from '../../utils/taxCalculator'

const PayBreakdownCard = ({
  result,
  rdiv,
}: {
  result: CalcResult
  rdiv: number
}) => {
  const { gross, pension, incomeTax, ni, net } = result
  const ofGross = (v: number) => gross > 0 ? (v / gross) * 100 : 0
  const fmtP    = (v: number) => fmtGBP(v / rdiv, 0)
  const fmtMo   = (v: number) => `${fmtGBP(v / 12, 0)} / mo`
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

export default PayBreakdownCard
