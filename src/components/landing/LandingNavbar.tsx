import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import FintraxxLogo from '../common/FintraxxLogo'
import { MAX_W } from './landingConstants'

const NAV_LINKS = [
  { label: 'Features', target: 'features' },
  { label: 'Pricing',  target: 'auth'     },
  { label: 'About',    target: 'footer'   },
]

const navLinkStyle: React.CSSProperties = {
  fontFamily:   'var(--font-ui)',
  fontSize:     '14px',
  color:        'var(--color-text-muted)',
  background:   'none',
  border:       'none',
  cursor:       'pointer',
  padding:      '6px 12px',
  borderRadius: '8px',
  transition:   'color 150ms ease, background 150ms ease',
}

const LandingNavbar = ({
  onSignIn,
  onGetStarted,
}: {
  onSignIn:     () => void
  onGetStarted: () => void
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setDrawerOpen(false)
  }

  return (
    <>
      <nav
        style={{
          position:      'sticky',
          top:           0,
          zIndex:        100,
          background:    'rgba(11,15,26,0.95)',
          backdropFilter:'blur(12px)',
          borderBottom:  '0.5px solid rgba(255,255,255,0.06)',
          height:        '62px',
        }}
      >
        <div
          style={{
            ...MAX_W,
            height:         '100%',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            gap:            '24px',
          }}
        >
          <FintraxxLogo />

          <div className='hidden lg:flex' style={{ alignItems: 'center', gap: '4px' }}>
            {NAV_LINKS.map(({ label, target }) => (
              <button
                key={label}
                onClick={() => scrollTo(target)}
                style={navLinkStyle}
                onMouseEnter={e => {
                  e.currentTarget.style.color      = 'var(--color-text-primary)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color      = 'var(--color-text-muted)'
                  e.currentTarget.style.background = 'none'
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={onSignIn}
              className='hidden sm:flex'
              style={{
                padding:      '7px 16px',
                borderRadius: '9px',
                border:       '0.5px solid rgba(255,255,255,0.12)',
                background:   'transparent',
                color:        'var(--color-text-primary)',
                fontFamily:   'var(--font-ui)',
                fontWeight:   500,
                fontSize:     '14px',
                cursor:       'pointer',
                transition:   'border-color 150ms ease, background 150ms ease',
                alignItems:   'center',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.24)'
                e.currentTarget.style.background  = 'rgba(255,255,255,0.04)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                e.currentTarget.style.background  = 'transparent'
              }}
            >
              Sign in
            </button>

            <button
              onClick={onGetStarted}
              style={{
                padding:      '7px 16px',
                borderRadius: '9px',
                border:       'none',
                background:   '#4DFFC3',
                color:        '#0B0F1A',
                fontFamily:   'var(--font-ui)',
                fontWeight:   700,
                fontSize:     '14px',
                cursor:       'pointer',
                transition:   'opacity 150ms ease, transform 150ms ease',
                whiteSpace:   'nowrap',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity   = '0.88'
                e.currentTarget.style.transform = 'scale(1.03)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity   = '1'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              Get started free
            </button>

            <button
              className='lg:hidden'
              onClick={() => setDrawerOpen(true)}
              aria-label='Open menu'
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                width:          '36px',
                height:         '36px',
                borderRadius:   '9px',
                border:         'none',
                background:     'transparent',
                color:          'var(--color-text-muted)',
                cursor:         'pointer',
                transition:     'background 150ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
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
              position:      'fixed',
              inset:         0,
              background:    'rgba(0,0,0,0.6)',
              backdropFilter:'blur(2px)',
              zIndex:        200,
              animation:     'fadeIn 150ms ease both',
            }}
          />
          <div
            style={{
              position:      'fixed',
              top:           0,
              left:          0,
              bottom:        0,
              width:         '260px',
              background:    '#0E1220',
              borderRight:   '0.5px solid rgba(255,255,255,0.07)',
              zIndex:        201,
              display:       'flex',
              flexDirection: 'column',
              padding:       '20px 12px',
              gap:           '4px',
              animation:     'slideInFromLeft 200ms ease both',
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
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--color-text-primary)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)' }}
              >
                {label}
              </button>
            ))}

            <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.07)', margin: '8px 4px' }} />

            <button
              onClick={() => { onSignIn(); setDrawerOpen(false) }}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '9px', border: 'none', background: 'transparent', color: 'var(--color-text-primary)', fontFamily: 'var(--font-ui)', fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}
            >
              Sign in
            </button>
            <button
              onClick={() => { onGetStarted(); setDrawerOpen(false) }}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '9px', border: 'none', background: '#4DFFC3', color: '#0B0F1A', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '14px', cursor: 'pointer', textAlign: 'center', marginTop: '4px' }}
            >
              Get started free
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default LandingNavbar
