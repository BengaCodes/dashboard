import { useRef, useState } from 'react'
import {
  Menu, X, ArrowRight,
  TrendingUp, PiggyBank, BarChart3,
  Shield, Zap, Users,
} from 'lucide-react'
import FintraxxLogo from '../common/FintraxxLogo'
import { useAuth } from '../../state/useAuth'

// ── Shared tokens ────────────────────────────────────────────

const SECTION_BORDER = '0.5px solid rgba(255,255,255,0.05)'

const MAX_W: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 40px',
}

// ── Landing Navbar ───────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Features', target: 'features' },
  { label: 'Pricing',  target: 'auth'     },
  { label: 'About',    target: 'footer'   },
]

const LandingNavbar = ({
  onSignIn,
  onGetStarted,
}: {
  onSignIn: () => void
  onGetStarted: () => void
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setDrawerOpen(false)
  }

  const navLinkStyle: React.CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: '8px',
    transition: 'color 150ms ease, background 150ms ease',
  }

  return (
    <>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(11,15,26,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '0.5px solid rgba(255,255,255,0.06)',
          height: '62px',
        }}
      >
        <div
          style={{
            ...MAX_W,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          {/* Logo */}
          <FintraxxLogo />

          {/* Center links — desktop */}
          <div className='hidden lg:flex' style={{ alignItems: 'center', gap: '4px' }}>
            {NAV_LINKS.map(({ label, target }) => (
              <button
                key={label}
                onClick={() => scrollTo(target)}
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-primary)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-muted)'
                  e.currentTarget.style.background = 'none'
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Right — auth buttons + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={onSignIn}
              className='hidden sm:flex'
              style={{
                padding: '7px 16px',
                borderRadius: '9px',
                border: '0.5px solid rgba(255,255,255,0.12)',
                background: 'transparent',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-ui)',
                fontWeight: 500,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'border-color 150ms ease, background 150ms ease',
                alignItems: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.24)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              Sign in
            </button>

            <button
              onClick={onGetStarted}
              style={{
                padding: '7px 16px',
                borderRadius: '9px',
                border: 'none',
                background: '#4DFFC3',
                color: '#0B0F1A',
                fontFamily: 'var(--font-ui)',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'opacity 150ms ease, transform 150ms ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.88'
                e.currentTarget.style.transform = 'scale(1.03)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              Get started free
            </button>

            {/* Hamburger — mobile only */}
            <button
              className='lg:hidden'
              onClick={() => setDrawerOpen(true)}
              aria-label='Open menu'
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '36px', height: '36px', borderRadius: '9px',
                border: 'none', background: 'transparent',
                color: 'var(--color-text-muted)', cursor: 'pointer',
                transition: 'background 150ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(2px)', zIndex: 200,
              animation: 'fadeIn 150ms ease both',
            }}
          />
          <div
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0, width: '260px',
              background: '#0E1220', borderRight: '0.5px solid rgba(255,255,255,0.07)',
              zIndex: 201, display: 'flex', flexDirection: 'column',
              padding: '20px 12px', gap: '4px',
              animation: 'slideInFromLeft 200ms ease both',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', marginBottom: '20px' }}>
              <FintraxxLogo />
              <button
                onClick={() => setDrawerOpen(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {NAV_LINKS.map(({ label, target }) => (
              <button
                key={label}
                onClick={() => scrollTo(target)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '9px', border: 'none', background: 'transparent', color: 'var(--color-text-muted)', fontFamily: 'var(--font-ui)', fontSize: '14px', cursor: 'pointer', textAlign: 'left', transition: 'background 150ms ease, color 150ms ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--color-text-primary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)' }}
              >
                {label}
              </button>
            ))}

            <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.07)', margin: '8px 4px' }} />

            <button onClick={() => { onSignIn(); setDrawerOpen(false) }}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '9px', border: 'none', background: 'transparent', color: 'var(--color-text-primary)', fontFamily: 'var(--font-ui)', fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
              Sign in
            </button>
            <button onClick={() => { onGetStarted(); setDrawerOpen(false) }}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '9px', border: 'none', background: '#4DFFC3', color: '#0B0F1A', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '14px', cursor: 'pointer', textAlign: 'center', marginTop: '4px' }}>
              Get started free
            </button>
          </div>
        </>
      )}
    </>
  )
}

// ── Hero preview card data ────────────────────────────────────

const MOCK_TXS = [
  { name: 'Monthly Salary',   category: 'Income',        amount: '3,240.00', income: true,  color: '#4DFFC3', initial: 'S' },
  { name: 'Tesco Groceries',  category: 'Food & Dining', amount: '89.50',    income: false, color: '#FF4E7A', initial: 'G' },
  { name: 'Netflix',          category: 'Subscriptions', amount: '15.99',    income: false, color: '#1EC8FF', initial: 'N' },
]

const PreviewCard = () => (
  <div
    className='hero-preview'
    style={{
      background: '#111626',
      borderRadius: '18px',
      border: '0.5px solid rgba(255,255,255,0.07)',
      padding: '28px',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {/* Balance */}
    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
      Net Balance
    </p>
    <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '38px', letterSpacing: '-2px', color: 'var(--color-text-primary)', lineHeight: 1, marginBottom: '20px' }}>
      £4,820
    </p>

    {/* Stat chips */}
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

    {/* Divider */}
    <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.06)', marginBottom: '18px' }} />

    {/* Recent transactions label */}
    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
      Recent transactions
    </p>

    {/* Transaction rows */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {MOCK_TXS.map(({ name, category, amount, income, color, initial }) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Category icon square */}
          <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '13px', color }}>{initial}</span>
          </div>
          {/* Description + category */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '13px', color: 'var(--color-text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>{category}</p>
          </div>
          {/* Amount */}
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
  onSeeHow: () => void
}) => (
  <section>
    <div
      className='hero-grid'
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '40px',
        padding: '72px 40px 60px',
        alignItems: 'center',
      }}
    >
      {/* ── Left column ─────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '99px', border: '0.5px solid rgba(77,255,195,0.25)', background: 'rgba(77,255,195,0.06)', alignSelf: 'flex-start' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4DFFC3', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#4DFFC3', letterSpacing: '0.08em' }}>
            Now with smart budget alerts
          </span>
        </div>

        {/* H1 */}
        <h1 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '48px', letterSpacing: '-2px', color: 'var(--color-text-primary)', lineHeight: 1.08, margin: 0 }}>
          Your finances,{' '}
          <span style={{ color: '#4DFFC3' }}>fully under</span>
          {' '}control
        </h1>

        {/* Subtitle */}
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '16px', color: '#5A6070', lineHeight: 1.7, margin: 0, maxWidth: '460px' }}>
          Track income, expenses, and budgets in one beautiful dashboard. Set smart limits,
          visualise spending, and stay ahead every single month.
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={onGetStarted}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 22px', borderRadius: '10px', border: 'none', background: '#4DFFC3', color: '#0B0F1A', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '15px', cursor: 'pointer', transition: 'opacity 150ms ease, transform 150ms ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.03)' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            Start for free <ArrowRight size={15} />
          </button>
          <button
            onClick={onSeeHow}
            style={{ padding: '12px 22px', borderRadius: '10px', border: '0.5px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'var(--color-text-primary)', fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '15px', cursor: 'pointer', transition: 'border-color 150ms ease, background 150ms ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.24)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'transparent' }}
          >
            See how it works
          </button>
        </div>

        {/* Trust line */}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>
          No credit card&nbsp;·&nbsp;Free forever plan&nbsp;·&nbsp;Cancel anytime
        </p>
      </div>

      {/* ── Right column — preview card ──────────────────── */}
      <PreviewCard />
    </div>
  </section>
)

// ── Stats Band ───────────────────────────────────────────────

const STATS = [
  { main: '12k',  unit: '+',  label: 'active users'    },
  { main: '£2.4', unit: 'b',  label: 'tracked to date' },
  { main: '4.9',  unit: '★',  label: 'avg rating'      },
  { main: '99',   unit: '%',  label: 'uptime SLA'      },
]

const StatsBand = () => (
  <section style={{
    borderTop:    '0.5px solid rgba(255,255,255,0.05)',
    borderBottom: '0.5px solid rgba(255,255,255,0.05)',
  }}>
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        padding: '0 40px',
      }}
      className='stats-band'
    >
      {STATS.map(({ main, unit, label }, i) => (
        <div
          key={label}
          className='stat-col'
          style={{
            textAlign: 'center',
            padding: '38px 24px',
            borderLeft: i > 0 ? '0.5px solid rgba(255,255,255,0.05)' : 'none',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 700,
            fontSize: '34px',
            letterSpacing: '-1.5px',
            color: 'var(--color-text-primary)',
            lineHeight: 1,
            marginBottom: '8px',
          }}>
            {main}<span style={{ color: '#4DFFC3' }}>{unit}</span>
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: '#3A4060',
            margin: 0,
          }}>
            {label}
          </p>
        </div>
      ))}
    </div>
  </section>
)

// ── Features Section ─────────────────────────────────────────

const FEATURES = [
  {
    icon: TrendingUp,
    accent: '#4DFFC3',
    tint: 'rgba(77,255,195,0.10)',
    title: 'Transaction tracking',
    desc: 'Categorise every income and expense. Import from Excel, log manually, or let recurring rules do the work.',
  },
  {
    icon: PiggyBank,
    accent: '#1EC8FF',
    tint: 'rgba(30,200,255,0.10)',
    title: 'Smart budgeting',
    desc: 'Set monthly limits per category. Get alerted before you overspend and see live progress bars update in real time.',
  },
  {
    icon: BarChart3,
    accent: '#A78BFA',
    tint: 'rgba(167,139,250,0.10)',
    title: 'Visual analytics',
    desc: 'Donut charts, category breakdowns, and monthly trends — everything you need to understand where your money goes.',
  },
  {
    icon: Shield,
    accent: '#FF4E7A',
    tint: 'rgba(255,78,122,0.10)',
    title: 'Secure by design',
    desc: 'JWT auth, bcrypt password hashing, and per-user data isolation. Your financial data is yours alone.',
  },
  {
    icon: Zap,
    accent: '#FFB547',
    tint: 'rgba(255,181,71,0.10)',
    title: 'Instant setup',
    desc: 'Sign up and 18 default categories are seeded automatically. You\'re tracking in under 60 seconds.',
  },
  {
    icon: Users,
    accent: '#4DFFC3',
    tint: 'rgba(77,255,195,0.10)',
    title: 'Open source',
    desc: 'Full NestJS + React stack. Self-host it, extend it, or contribute. No black boxes.',
  },
]

const FeaturesSection = () => (
  <section id='features' style={{ borderTop: SECTION_BORDER }}>
    <div style={{ ...MAX_W, padding: '96px 40px' }}>

      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4DFFC3', marginBottom: '16px' }}>
          Why FinTraxx
        </p>
        <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 'clamp(26px, 4vw, 42px)', letterSpacing: '-1px', color: 'var(--color-text-primary)', margin: 0 }}>
          Everything you need, nothing you don't
        </h2>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className='features-grid'>
        {FEATURES.map(({ icon: Icon, accent, tint, title, desc }) => (
          <div
            key={title}
            style={{ background: 'var(--color-bg-surface)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '12px', background: tint, flexShrink: 0 }}>
              <Icon size={20} color={accent} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '15px', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                {title}
              </h3>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.65 }}>
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

// ── Auth Section ─────────────────────────────────────────────

const AuthSection = ({
  mode,
  onModeChange,
}: {
  mode: 'signin' | 'signup'
  onModeChange: (m: 'signin' | 'signup') => void
}) => {
  const { signIn, signUp } = useAuth()
  const [email,           setEmail]           = useState('')
  const [password,        setPassword]        = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error,           setError]           = useState('')
  const [pending,         setPending]         = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setPending(true)
    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) { setError('Passwords do not match'); return }
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setPending(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: '9px',
    border: '0.5px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)', color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-mono)', fontSize: '14px', outline: 'none',
    transition: 'border-color 150ms ease',
  }

  return (
    <section id='auth' style={{ borderTop: SECTION_BORDER }}>
      <div style={{ ...MAX_W, padding: '96px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4DFFC3', marginBottom: '16px' }}>
            Start today
          </p>
          <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 'clamp(24px, 3.5vw, 38px)', letterSpacing: '-1px', color: 'var(--color-text-primary)', margin: 0 }}>
            {mode === 'signup' ? 'Create your free account' : 'Welcome back'}
          </h2>
        </div>

        {/* Auth card */}
        <div style={{ width: '100%', maxWidth: '420px', background: 'var(--color-bg-surface)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>

          {/* Tab switcher */}
          <div style={{ display: 'flex', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
            {(['signin', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { onModeChange(m); setError('') }}
                style={{
                  flex: 1, padding: '14px', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-ui)', fontWeight: mode === m ? 600 : 400,
                  fontSize: '14px',
                  background: mode === m ? 'rgba(77,255,195,0.06)' : 'transparent',
                  color: mode === m ? '#4DFFC3' : 'var(--color-text-muted)',
                  borderBottom: mode === m ? '1.5px solid #4DFFC3' : '1.5px solid transparent',
                  transition: 'all 150ms ease',
                }}
              >
                {m === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                Email
              </label>
              <input
                type='email' required autoComplete='email'
                placeholder='you@example.com'
                value={email} onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(77,255,195,0.4)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type='password' required
                placeholder='••••••••'
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                value={password} onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(77,255,195,0.4)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                  Confirm password
                </label>
                <input
                  type='password' required autoComplete='new-password'
                  placeholder='••••••••'
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(77,255,195,0.4)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                />
              </div>
            )}

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,78,122,0.10)', border: '0.5px solid rgba(255,78,122,0.25)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#FF4E7A' }}>{error}</p>
              </div>
            )}

            <button
              type='submit'
              disabled={pending}
              style={{ padding: '12px', borderRadius: '9px', border: 'none', background: '#4DFFC3', color: '#0B0F1A', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '14px', cursor: pending ? 'not-allowed' : 'pointer', opacity: pending ? 0.7 : 1, transition: 'opacity 150ms ease, transform 150ms ease', marginTop: '4px' }}
              onMouseEnter={(e) => { if (!pending) e.currentTarget.style.opacity = '0.88' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = pending ? '0.7' : '1' }}
            >
              {pending ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>

            <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)' }}>
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type='button'
                onClick={() => { onModeChange(mode === 'signin' ? 'signup' : 'signin'); setError('') }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4DFFC3', fontFamily: 'var(--font-mono)', fontSize: '12px', padding: 0 }}
              >
                {mode === 'signin' ? 'Sign up free' : 'Sign in'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

// ── Footer ───────────────────────────────────────────────────

const FOOTER_LINKS = [
  { label: 'Features',  target: 'features' },
  { label: 'Sign up',   target: 'auth'     },
  { label: 'Sign in',   target: 'auth'     },
  { label: 'GitHub',    href: '#'          },
]

const Footer = () => (
  <footer id='footer' style={{ borderTop: SECTION_BORDER }}>
    <div style={{ ...MAX_W, padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <FintraxxLogo />
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)', maxWidth: '240px', lineHeight: 1.6 }}>
            A full-stack personal finance dashboard built with NestJS and React.
          </p>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {FOOTER_LINKS.map(({ label, target, href }) => (
            <button
              key={label}
              onClick={() => target && document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text-muted)', padding: 0, transition: 'color 150ms ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
            >
              {href ? <a href={href} style={{ color: 'inherit', textDecoration: 'none' }}>{label}</a> : label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.05)', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)' }}>
          © {new Date().getFullYear()} FinTraxx. All rights reserved.
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)' }}>
          Built with React + NestJS
        </p>
      </div>
    </div>
  </footer>
)

// ── Landing Page ─────────────────────────────────────────────

const LandingPage = () => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const authRef = useRef<HTMLElement>(null)

  const goToAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    // Slight delay so state update renders before scrolling
    setTimeout(() => {
      authRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 40)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>
      <LandingNavbar
        onSignIn={() => goToAuth('signin')}
        onGetStarted={() => goToAuth('signup')}
      />
      <HeroSection
        onGetStarted={() => goToAuth('signup')}
        onSeeHow={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
      />
      <StatsBand />
      <FeaturesSection />
      <section ref={authRef} style={{ scrollMarginTop: '80px' }}>
        <AuthSection mode={authMode} onModeChange={setAuthMode} />
      </section>
      <Footer />
    </div>
  )
}

export default LandingPage
