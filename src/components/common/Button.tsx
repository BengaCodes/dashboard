import React, { type ReactNode } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const VARIANT_STYLES: Record<NonNullable<ButtonProps['variant']>, React.CSSProperties> = {
  primary: {
    background: '#4DFFC3',
    color: '#0B0F1A',
    border: 'none',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--color-text-primary)',
    border: '0.5px solid rgba(255,255,255,0.14)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-text-muted)',
    border: 'none',
  },
  danger: {
    background: 'rgba(255,78,122,0.10)',
    color: '#FF4E7A',
    border: '0.5px solid rgba(255,78,122,0.25)',
  },
  success: {
    background: '#4DFFC3',
    color: '#0B0F1A',
    border: 'none',
  },
}

const HOVER_STYLES: Record<NonNullable<ButtonProps['variant']>, Partial<React.CSSProperties>> = {
  primary:   { opacity: '0.88' as unknown as undefined, transform: 'scale(1.02)' },
  secondary: { background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.24)' },
  ghost:     { background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-primary)' },
  danger:    { background: 'rgba(255,78,122,0.18)' },
  success:   { opacity: '0.88' as unknown as undefined, transform: 'scale(1.02)' },
}

const SIZE_STYLES: Record<NonNullable<ButtonProps['size']>, React.CSSProperties> = {
  sm: { padding: '6px 12px',  fontSize: '12px' },
  md: { padding: '9px 18px',  fontSize: '13px' },
  lg: { padding: '11px 24px', fontSize: '14px' },
}

const Button = ({
  variant = 'primary',
  size = 'md',
  style,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    borderRadius: '9px',
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'opacity 150ms ease, background 150ms ease, border-color 150ms ease, transform 150ms ease, color 150ms ease',
    whiteSpace: 'nowrap',
    ...VARIANT_STYLES[variant],
    ...SIZE_STYLES[size],
    ...style,
  }

  return (
    <button
      disabled={disabled}
      style={base}
      onMouseEnter={(e) => {
        if (disabled) return
        const hover = HOVER_STYLES[variant]
        const el = e.currentTarget
        if (hover.opacity !== undefined) el.style.opacity = String(hover.opacity)
        if (hover.transform)            el.style.transform = hover.transform
        if (hover.background)           el.style.background = String(hover.background)
        if (hover.borderColor)          el.style.borderColor = String(hover.borderColor)
        if (hover.color)               el.style.color = String(hover.color)
      }}
      onMouseLeave={(e) => {
        if (disabled) return
        const el = e.currentTarget
        el.style.opacity    = '1'
        el.style.transform  = ''
        el.style.background = String(VARIANT_STYLES[variant].background ?? 'transparent')
        el.style.borderColor = String(
          (VARIANT_STYLES[variant].border as string | undefined)?.split(' ').at(-1) ?? ''
        )
        el.style.color = String(VARIANT_STYLES[variant].color ?? '')
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
