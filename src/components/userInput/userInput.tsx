import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../state/useAuth'

// ── Helpers ──────────────────────────────────────────────────

function getInitials(email: string): string {
  const local = email.split('@')[0]
  const parts = local.split(/[._-]/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return local.slice(0, 2).toUpperCase()
}

function getDisplayName(email: string): string {
  const local = email.split('@')[0]
  const parts = local.split(/[._-]/).filter(Boolean)
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
}

// ── Dropdown Item ─────────────────────────────────────────────

type DropdownItemProps = {
  icon: LucideIcon
  label: string
  variant?: 'default' | 'purple' | 'danger'
  onClick?: () => void
}

const VARIANT_COLORS = {
  default: {
    icon: 'var(--color-text-muted)',
    text: 'var(--color-text-primary)',
    hover: 'rgba(255,255,255,0.04)',
    hoverText: 'var(--color-text-primary)',
  },
  purple: {
    icon: '#A78BFA',
    text: '#A78BFA',
    hover: 'rgba(167,139,250,0.08)',
    hoverText: '#C4B5FD',
  },
  danger: {
    icon: '#FF4E7A',
    text: '#FF4E7A',
    hover: 'rgba(255,78,122,0.08)',
    hoverText: '#FF4E7A',
  },
}

const DropdownItem = ({
  icon: Icon,
  label,
  variant = 'default',
  onClick,
}: DropdownItemProps) => {
  const [hovered, setHovered] = useState(false)
  const colors = VARIANT_COLORS[variant]

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
        padding: '8px 12px',
        borderRadius: '8px',
        border: 'none',
        background: hovered ? colors.hover : 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 150ms ease',
      }}
    >
      <Icon
        size={15}
        style={{
          color: hovered ? colors.hoverText : colors.icon,
          flexShrink: 0,
          transition: 'color 150ms ease',
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '12px',
          color: hovered ? colors.hoverText : colors.text,
          transition: 'color 150ms ease',
        }}
      >
        {label}
      </span>
    </button>
  )
}

// ── Divider ───────────────────────────────────────────────────

const Divider = () => (
  <div
    style={{
      height: '0.5px',
      background: 'rgba(255,255,255,0.07)',
      margin: '4px 0',
    }}
  />
)

// ── UserInput ─────────────────────────────────────────────────

const UserInput = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const ref = useRef<HTMLDivElement>(null)

  // (1) Outside click  (2) Escape key — both in one effect, one cleanup
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  // (4) Route change — close whenever the pathname changes
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const handleSignout = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  const email      = user?.email ?? ''
  const initials   = email ? getInitials(email) : '??'
  const name       = email ? getDisplayName(email) : 'Account'

  return (
    <div style={{ position: 'relative', flexShrink: 0 }} ref={ref}>

      {/* ── Trigger button ─────────────────────────────── */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-haspopup='true'
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 10px',
          borderRadius: '9px',
          border: 'none',
          background: isOpen ? 'rgba(255,255,255,0.06)' : 'transparent',
          cursor: 'pointer',
          transition: 'background 150ms ease',
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.background = 'transparent'
        }}
      >
        {/* Avatar */}
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4DFFC3 0%, #1EC8FF 100%)',
            fontFamily: 'var(--font-ui)',
            fontWeight: 700,
            fontSize: '11px',
            color: '#0B0F1A',
            flexShrink: 0,
            letterSpacing: '0.02em',
          }}
        >
          {initials}
        </span>

        {/* Email */}
        <span
          className='hidden sm:block'
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
            maxWidth: '148px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {email}
        </span>

        {/* Chevron — rotates 180° when open */}
        <ChevronDown
          size={14}
          style={{
            color: 'var(--color-text-muted)',
            flexShrink: 0,
            transition: 'transform 200ms ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* ── Dropdown ───────────────────────────────────── */}
      {isOpen && (
        <div
          className='animate-fade-in'
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '220px',
            background: '#131B2E',
            border: '0.5px solid rgba(255,255,255,0.10)',
            borderRadius: '12px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 16px',
              borderBottom: '0.5px solid rgba(255,255,255,0.07)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 700,
                fontSize: '13px',
                color: 'var(--color-text-primary)',
                marginBottom: '3px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {name}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-text-muted)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {email}
            </p>
          </div>

          {/* Main menu items — (3) any click bubbles up and closes */}
          <div style={{ padding: '6px' }} onClick={() => setIsOpen(false)}>
            <DropdownItem
              icon={Settings}
              label='Settings & preferences'
              variant='purple'
              onClick={() => navigate('/settings')}
            />
            <DropdownItem icon={User} label='Edit profile' />
            <DropdownItem icon={Bell} label='Notifications' />
          </div>

          <Divider />

          {/* Sign out — (3) same close-on-click via bubbling */}
          <div style={{ padding: '6px' }} onClick={() => setIsOpen(false)}>
            <DropdownItem
              icon={LogOut}
              label='Sign out'
              variant='danger'
              onClick={handleSignout}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default UserInput
