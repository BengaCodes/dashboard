import FintraxxLogo from '../common/FintraxxLogo'
import { SECTION_BORDER, MAX_W } from './landingConstants'

const FOOTER_LINKS = [
  { label: 'Features', target: 'features' },
  { label: 'Sign up',  target: 'auth'     },
  { label: 'Sign in',  target: 'auth'     },
]

const LandingFooter = () => (
  <footer id='footer' style={{ borderTop: SECTION_BORDER }}>
    <div style={{ ...MAX_W, padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <FintraxxLogo />
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)', maxWidth: '240px', lineHeight: 1.6 }}>
            A personal finance dashboard built with your future in mind.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {FOOTER_LINKS.map(({ label, target }) => (
            <button
              key={label}
              onClick={() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text-muted)', padding: 0, transition: 'color 150ms ease' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text-primary)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)' }}>
          © {new Date().getFullYear()} FinTraxx. All rights reserved.
        </p>
      </div>

    </div>
  </footer>
)

export default LandingFooter
