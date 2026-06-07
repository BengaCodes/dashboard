import type { CalcResult, Region } from '../../utils/taxCalculator'
import { FULL_RUK_BANDS, FULL_SCO_BANDS, fmtGBP } from '../../utils/taxCalculator'

const VisualBreakdownCard = ({
  result,
  region,
}: {
  result: CalcResult
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
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  {bar.label}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: bar.color }}>
                  {barPct.toFixed(1)}%
                </span>
              </div>
              <div style={{ height: '6px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
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

      <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.06)', marginBottom: '14px' }} />

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

              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px', textAlign: 'right',
                color: isHigh  ? '#FF4E7A'
                     : isEmpty ? 'rgba(255,255,255,0.15)'
                     : 'var(--color-text-primary)',
                fontWeight: isHigh ? 600 : 400,
              }}>
                {isEmpty ? '—' : fmtGBP(band.taxable)}
              </span>

              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px', textAlign: 'right',
                color: isHigh         ? '#FF4E7A'
                     : isEmpty        ? 'rgba(255,255,255,0.15)'
                     : band.rate > 0  ? 'rgba(255,78,122,0.7)'
                     : 'rgba(255,255,255,0.2)',
                fontWeight: isHigh ? 600 : 400,
              }}>
                {isEmpty       ? '—'
                 : band.rate > 0 ? `−${fmtGBP(band.tax)}`
                 : 'Free'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default VisualBreakdownCard
