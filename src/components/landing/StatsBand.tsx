const STATS = [
  { main: '12k',  unit: '+', label: 'active users'    },
  { main: '£2.4', unit: 'b', label: 'tracked to date' },
  { main: '4.9',  unit: '★', label: 'avg rating'      },
  { main: '99',   unit: '%', label: 'uptime SLA'       },
]

const StatsBand = () => (
  <section
    style={{
      borderTop:    '0.5px solid rgba(255,255,255,0.05)',
      borderBottom: '0.5px solid rgba(255,255,255,0.05)',
    }}
  >
    <div
      style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '0 40px' }}
      className='stats-band'
    >
      {STATS.map(({ main, unit, label }, i) => (
        <div
          key={label}
          className='stat-col'
          style={{ textAlign: 'center', padding: '38px 24px', borderLeft: i > 0 ? '0.5px solid rgba(255,255,255,0.05)' : 'none' }}
        >
          <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '34px', letterSpacing: '-1.5px', color: 'var(--color-text-primary)', lineHeight: 1, marginBottom: '8px' }}>
            {main}<span style={{ color: '#4DFFC3' }}>{unit}</span>
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>
            {label}
          </p>
        </div>
      ))}
    </div>
  </section>
)

export default StatsBand
