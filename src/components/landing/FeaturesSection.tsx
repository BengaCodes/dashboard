import { TrendingUp, PiggyBank, BarChart3, Shield, Zap, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SECTION_BORDER, MAX_W } from './landingConstants'

// ── Feature data ─────────────────────────────────────────────

type Feature = {
  icon:   LucideIcon
  accent: string
  tint:   string
  title:  string
  desc:   string
}

const FEATURES: Feature[] = [
  {
    icon:   TrendingUp,
    accent: '#4DFFC3',
    tint:   'rgba(77,255,195,0.10)',
    title:  'Transaction tracking',
    desc:   'Categorise every income and expense. Import from Excel, log manually, or let recurring rules do the work.',
  },
  {
    icon:   PiggyBank,
    accent: '#1EC8FF',
    tint:   'rgba(30,200,255,0.10)',
    title:  'Smart budgeting',
    desc:   'Set monthly limits per category. Get alerted before you overspend and see live progress bars update in real time.',
  },
  {
    icon:   BarChart3,
    accent: '#A78BFA',
    tint:   'rgba(167,139,250,0.10)',
    title:  'Visual analytics',
    desc:   'Donut charts, category breakdowns, and monthly trends — everything you need to understand where your money goes.',
  },
  {
    icon:   Shield,
    accent: '#FF4E7A',
    tint:   'rgba(255,78,122,0.10)',
    title:  'Secure by design',
    desc:   'JWT auth, bcrypt password hashing, and per-user data isolation. Your financial data is yours alone.',
  },
  {
    icon:   Zap,
    accent: '#FFB547',
    tint:   'rgba(255,181,71,0.10)',
    title:  'Instant setup',
    desc:   "Sign up and 18 default categories are seeded automatically. You're tracking in under 60 seconds.",
  },
  {
    icon:   Users,
    accent: '#4DFFC3',
    tint:   'rgba(77,255,195,0.10)',
    title:  'Built for everyone',
    desc:   'Designed to be intuitive from day one. No financial expertise required — just your income and expenses.',
  },
]

// ── Features Section ─────────────────────────────────────────
//
// Bento layout:
//   row 1  [Transaction tracking · span 2] [Smart budgeting]
//   row 2  [Visual analytics] [Secure by design] [Instant setup]
//   row 3  [Built for everyone · span 3, wide card]

const FeaturesSection = () => (
  <section id='features' style={{ borderTop: SECTION_BORDER }}>
    <div style={{ ...MAX_W, padding: '96px 40px' }}>

      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4DFFC3', marginBottom: '16px' }}>
          Why FinTraxx
        </p>
        <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 'clamp(26px, 4vw, 42px)', letterSpacing: '-1px', color: 'var(--color-text-primary)', margin: 0 }}>
          Everything you need, nothing you don't
        </h2>
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}
        className='features-grid'
      >
        {FEATURES.map(({ icon: Icon, accent, tint, title, desc }, idx) => {
          const isHero = idx === 0  // Transaction tracking — spans 2 cols
          const isFull = idx === 5  // Built for everyone — full-width

          return (
            <div
              key={title}
              className={isHero ? 'feature-card--hero' : isFull ? 'feature-card--full' : undefined}
              style={{
                gridColumn:    isHero ? 'span 2' : isFull ? 'span 3' : undefined,
                background:    isHero ? tint : isFull ? 'rgba(30,200,255,0.04)' : 'var(--color-bg-surface)',
                border:        `0.5px solid ${isHero ? 'rgba(77,255,195,0.18)' : isFull ? 'rgba(30,200,255,0.18)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius:  '14px',
                padding:       isHero ? '32px' : isFull ? '28px 32px' : '28px',
                display:       'flex',
                flexDirection: isFull ? 'row' : 'column',
                gap:           isFull ? '28px' : '16px',
                alignItems:    isFull ? 'center' : undefined,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: isHero ? '52px' : '44px', height: isHero ? '52px' : '44px', borderRadius: '12px', background: tint, flexShrink: 0 }}>
                <Icon size={isHero ? 24 : 20} color={accent} />
              </div>

              <div style={{ flex: isFull ? 1 : undefined }}>
                <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: isHero ? '17px' : '15px', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                  {title}
                </h3>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.65 }}>
                  {desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  </section>
)

export default FeaturesSection
