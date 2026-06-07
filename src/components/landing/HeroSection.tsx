import { ArrowRight } from 'lucide-react'

// ── Mock data for the product preview ───────────────────────

const MOCK_TXS = [
  { name: 'Monthly Salary',  category: 'Income',        amount: '3,240.00', income: true,  color: '#4DFFC3', initial: 'S' },
  { name: 'Tesco Groceries', category: 'Food & Dining', amount: '89.50',    income: false, color: '#FF4E7A', initial: 'G' },
  { name: 'Netflix',         category: 'Subscriptions', amount: '15.99',    income: false, color: '#1EC8FF', initial: 'N' },
]

// ── Inline product preview ───────────────────────────────────

const PreviewCard = () => (
  <div
    className='hero-preview'
    style={{
      background:    '#111626',
      borderRadius:  '16px',
      border:        '0.5px solid rgba(255,255,255,0.07)',
      padding:       '28px',
      display:       'flex',
      flexDirection: 'column',
    }}
  >
    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
      Net Balance
    </p>
    <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '38px', letterSpacing: '-2px', color: 'var(--color-text-primary)', lineHeight: 1, marginBottom: '20px' }}>
      £4,820
    </p>

    <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 12px', borderRadius: '9px', background: 'rgba(77,255,195,0.08)', border: '0.5px solid rgba(77,255,195,0.18)', flex: 1 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(77,255,195,0.6)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Income</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px', color: '#4DFFC3', marginLeft: 'auto' }}>+£3,240</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 12px', borderRadius: '9px', background: 'rgba(255,78,122,0.08)', border: '0.5px solid rgba(255,78,122,0.18)', flex: 1 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,78,122,0.6)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Expenses</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px', color: '#FF4E7A', marginLeft: 'auto' }}>-£1,580</span>
      </div>
    </div>

    <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.06)', marginBottom: '18px' }} />

    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
      Recent transactions
    </p>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {MOCK_TXS.map(({ name, category, amount, income, color, initial }) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '13px', color }}>{initial}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '13px', color: 'var(--color-text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>{category}</p>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px', color: income ? '#4DFFC3' : '#FF4E7A', flexShrink: 0 }}>
            {income ? '+' : '−'}£{amount}
          </span>
        </div>
      ))}
    </div>
  </div>
)

// ── Hero Section ─────────────────────────────────────────────

const HeroSection = ({
  onGetStarted,
  onSeeHow,
}: {
  onGetStarted: () => void
  onSeeHow:     () => void
}) => (
  <section>
    <div
      className='hero-grid'
      style={{
        maxWidth:            '1200px',
        margin:              '0 auto',
        display:             'grid',
        gridTemplateColumns: '1fr 380px',
        gap:                 '40px',
        padding:             '72px 40px 60px',
        alignItems:          'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '99px', border: '0.5px solid rgba(77,255,195,0.25)', background: 'rgba(77,255,195,0.06)', alignSelf: 'flex-start' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4DFFC3', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#4DFFC3', letterSpacing: '0.08em' }}>
            Now with smart budget alerts
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '48px', letterSpacing: '-2px', color: 'var(--color-text-primary)', lineHeight: 1.08, margin: 0 }}>
          Your finances,{' '}
          <span style={{ color: '#4DFFC3' }}>fully under</span>{' '}
          control
        </h1>

        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '16px', color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, maxWidth: '460px' }}>
          Track income, expenses, and budgets in one beautiful dashboard. Set
          smart limits, visualise spending, and stay ahead every single month.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={onGetStarted}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 22px', borderRadius: '10px', border: 'none', background: '#4DFFC3', color: '#0B0F1A', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '15px', cursor: 'pointer', transition: 'opacity 150ms ease, transform 150ms ease' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.03)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1';    e.currentTarget.style.transform = 'scale(1)' }}
          >
            Get started free <ArrowRight size={15} />
          </button>
          <button
            onClick={onSeeHow}
            style={{ padding: '12px 22px', borderRadius: '10px', border: '0.5px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'var(--color-text-primary)', fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '15px', cursor: 'pointer', transition: 'border-color 150ms ease, background 150ms ease' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.24)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'transparent' }}
          >
            See how it works
          </button>
        </div>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>
          No credit card&nbsp;·&nbsp;Free forever plan&nbsp;·&nbsp;Cancel anytime
        </p>
      </div>

      <PreviewCard />
    </div>
  </section>
)

export default HeroSection
