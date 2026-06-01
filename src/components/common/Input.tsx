import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

const Input = ({ label, error, hint, id, ...props }: InputProps) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        htmlFor={inputId}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--color-text-muted)',
        }}
      >
        {label}
        {props.required && (
          <span style={{ marginLeft: '4px', color: '#FF4E7A' }}>*</span>
        )}
      </label>
      <input
        id={inputId}
        style={{
          width: '100%',
          padding: '9px 12px',
          borderRadius: '8px',
          border: error
            ? '0.5px solid rgba(255,78,122,0.5)'
            : '0.5px solid rgba(255,255,255,0.08)',
          background: '#0D1120',
          color: 'var(--color-text-primary)',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          outline: 'none',
          transition: 'border-color 150ms ease',
          colorScheme: 'dark',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error
            ? 'rgba(255,78,122,0.7)'
            : 'rgba(77,255,195,0.4)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error
            ? 'rgba(255,78,122,0.5)'
            : 'rgba(255,255,255,0.08)'
        }}
        {...props}
      />
      {error && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#FF4E7A' }}>
          {error}
        </p>
      )}
      {hint && !error && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
          {hint}
        </p>
      )}
    </div>
  )
}

export default Input
