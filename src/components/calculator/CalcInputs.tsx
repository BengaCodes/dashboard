import type { ReactNode } from 'react'

const S = {
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    color: 'var(--color-text-muted)',
    marginBottom: '5px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '0.5px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    outline: 'none',
    transition: 'border-color 150ms ease',
    colorScheme: 'dark' as const,
    boxSizing: 'border-box' as const,
  },
}

export const CalcCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{
    borderRadius: '10px',
    border: '0.5px solid rgba(255,255,255,0.07)',
    background: 'rgba(255,255,255,0.015)',
    overflow: 'hidden',
  }}>
    <div style={{
      padding: '7px 14px',
      borderBottom: '0.5px solid rgba(255,255,255,0.06)',
      background: 'rgba(255,255,255,0.02)',
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: 'rgba(255,255,255,0.35)',
      }}>
        {title}
      </span>
    </div>
    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {children}
    </div>
  </div>
)

export const FieldInput = ({
  label, value, onChange,
  type = 'text', prefix, suffix, placeholder, min, max, step, large,
}: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; prefix?: string; suffix?: string; placeholder?: string
  min?: string; max?: string; step?: string; large?: boolean
}) => (
  <div>
    <span style={S.label}>{label}</span>
    <div style={{ position: 'relative' }}>
      {prefix && (
        <span style={{
          position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
          fontFamily: 'var(--font-mono)',
          fontSize: large ? '15px' : '13px',
          color: '#4DFFC3',
          pointerEvents: 'none', userSelect: 'none',
        }}>
          {prefix}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        min={min} max={max} step={step}
        style={{
          ...S.input,
          paddingLeft: prefix ? (large ? '24px' : '22px') : '12px',
          paddingRight: suffix ? '32px' : '12px',
          fontSize: large ? '15px' : '13px',
          fontWeight: large ? 700 : 400,
        }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(77,255,195,0.4)' }}
        onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
      />
      {suffix && (
        <span style={{
          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
          fontFamily: 'var(--font-mono)', fontSize: '11px',
          color: 'var(--color-text-muted)', pointerEvents: 'none',
        }}>
          {suffix}
        </span>
      )}
    </div>
  </div>
)

export const FieldSelect = <T extends string>({
  label, value, onChange, options,
}: {
  label?: string; value: T; onChange: (v: T) => void
  options: { value: T; label: string }[]
}) => (
  <div>
    {label && <span style={S.label}>{label}</span>}
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value as T)}
        style={{ ...S.input, appearance: 'none', paddingRight: '28px', cursor: 'pointer' }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(77,255,195,0.4)' }}
        onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <svg width='10' height='10' viewBox='0 0 12 12' style={{
        position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
        pointerEvents: 'none', color: 'var(--color-text-muted)',
      }}>
        <path d='M2 4l4 4 4-4' stroke='currentColor' strokeWidth='1.5' fill='none' strokeLinecap='round' strokeLinejoin='round' />
      </svg>
    </div>
  </div>
)

export const CalcToggle = ({
  checked, onChange, label, hint,
}: {
  checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string
}) => (
  <div
    style={{
      display: 'flex', alignItems: 'flex-start',
      justifyContent: 'space-between', gap: '12px',
      cursor: 'pointer', userSelect: 'none',
    }}
    onClick={() => onChange(!checked)}
  >
    <div style={{ flex: 1, minWidth: 0 }}>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-text-primary)' }}>
        {label}
      </span>
      {hint && (
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px',
          color: 'var(--color-text-muted)', marginTop: '2px', lineHeight: 1.4,
        }}>
          {hint}
        </p>
      )}
    </div>
    <div style={{
      flexShrink: 0, marginTop: '2px',
      width: '34px', height: '18px', borderRadius: '99px',
      background: checked ? 'rgba(77,255,195,0.18)' : 'rgba(255,255,255,0.06)',
      border: `1px solid ${checked ? 'rgba(77,255,195,0.45)' : 'rgba(255,255,255,0.12)'}`,
      position: 'relative', transition: 'all 180ms ease',
    }}>
      <div style={{
        position: 'absolute', top: '2px',
        left: checked ? '16px' : '2px',
        width: '12px', height: '12px', borderRadius: '99px',
        background: checked ? '#4DFFC3' : 'rgba(255,255,255,0.3)',
        transition: 'all 180ms ease',
        boxShadow: checked ? '0 0 6px rgba(77,255,195,0.4)' : 'none',
      }} />
    </div>
  </div>
)

export const inputBaseStyle = S.input
export const labelStyle = S.label
