import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, Settings, X } from 'lucide-react'
import FintraxxLogo from '../common/FintraxxLogo'
import UserInput from '../userInput/userInput'

// ── Route map ────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Overview',      path: '/'             },
  { label: 'Transactions',  path: '/transactions' },
  { label: 'Budgets',       path: '/budgets'      },
  { label: 'Analytics',     path: '/analytics'    },
] as const

function isLinkActive(linkPath: string, pathname: string): boolean {
  // Exact match for root so "/transactions" etc. don't light up Overview
  if (linkPath === '/') return pathname === '/'
  // Exact match OR any nested segment (e.g. /transactions/123 → Transactions active)
  return pathname === linkPath || pathname.startsWith(linkPath + '/')
}

// ── Desktop nav link ─────────────────────────────────────────

const NavLink = ({
  label,
  path,
  active,
  onClick,
}: {
  label: string
  path: string
  active: boolean
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    style={{
      fontFamily: 'var(--font-ui)',
      fontWeight: active ? 600 : 400,
      fontSize: '14px',
      padding: '6px 14px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background 150ms ease, color 150ms ease',
      background: active ? 'rgba(77,255,195,0.08)' : 'transparent',
      color: active ? 'var(--color-accent-green)' : 'var(--color-text-muted)',
      letterSpacing: '0.01em',
      whiteSpace: 'nowrap',
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.color = 'var(--color-text-primary)'
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.color = 'var(--color-text-muted)'
        e.currentTarget.style.background = 'transparent'
      }
    }}
  >
    {label}
  </button>
)

// ── Mobile drawer ────────────────────────────────────────────

const MobileDrawer = ({
  open,
  onClose,
  pathname,
  navigate,
}: {
  open: boolean
  onClose: () => void
  pathname: string
  navigate: (path: string) => void
}) => {
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onClose])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const go = (path: string) => {
    navigate(path)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(2px)',
          zIndex: 200,
          animation: 'fadeIn 150ms ease both',
        }}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '260px',
          background: '#0E1220',
          borderRight: '0.5px solid rgba(255,255,255,0.07)',
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 12px',
          gap: '4px',
          animation: 'slideInFromLeft 200ms ease both',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 8px',
            marginBottom: '20px',
          }}
        >
          <FintraxxLogo />
          <button
            onClick={onClose}
            aria-label='Close menu'
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              transition: 'background 150ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        {NAV_LINKS.map(({ label, path }) => {
          const active = isLinkActive(path, pathname)
          return (
            <button
              key={path}
              onClick={() => go(path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '9px',
                border: 'none',
                background: active ? 'rgba(77,255,195,0.08)' : 'transparent',
                color: active ? 'var(--color-accent-green)' : 'var(--color-text-muted)',
                fontFamily: 'var(--font-ui)',
                fontWeight: active ? 600 : 400,
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 150ms ease, color 150ms ease',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.color = 'var(--color-text-primary)'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--color-text-muted)'
                }
              }}
            >
              {label}
            </button>
          )
        })}

        {/* Divider */}
        <div
          style={{
            height: '0.5px',
            background: 'rgba(255,255,255,0.07)',
            margin: '8px 4px',
          }}
        />

        {/* Settings & preferences — no active state, not a main nav item */}
        <button
          onClick={() => go('/settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '10px 12px',
            borderRadius: '9px',
            border: 'none',
            background: 'transparent',
            color: '#A78BFA',
            fontFamily: 'var(--font-ui)',
            fontWeight: 400,
            fontSize: '14px',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'background 150ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(167,139,250,0.08)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <Settings size={15} style={{ color: '#A78BFA', flexShrink: 0 }} />
          Settings &amp; preferences
        </button>
      </div>
    </>
  )
}

// ── Navbar ───────────────────────────────────────────────────

const Navbar = () => {
  const { pathname } = useLocation()
  const navigate     = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <nav
        style={{
          background: '#0E1220',
          borderBottom: '0.5px solid rgba(255,255,255,0.07)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          {/* Left — logo */}
          <FintraxxLogo />

          {/* Center — nav links (desktop only) */}
          <div
            className='hidden lg:flex'
            style={{ alignItems: 'center', gap: '4px' }}
          >
            {NAV_LINKS.map(({ label, path }) => (
              <NavLink
                key={path}
                label={label}
                path={path}
                active={isLinkActive(path, pathname)}
                onClick={() => navigate(path)}
              />
            ))}
          </div>

          {/* Right — user button (desktop) + hamburger (mobile) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* User dropdown — always visible */}
            <div className='hidden sm:block'>
              <UserInput />
            </div>

            {/* Hamburger — mobile only */}
            <button
              className='lg:hidden'
              onClick={() => setDrawerOpen(true)}
              aria-label='Open menu'
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '9px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
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
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pathname={pathname}
        navigate={navigate}
      />
    </>
  )
}

export default Navbar
