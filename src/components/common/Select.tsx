import { ChevronDown } from 'lucide-react'
import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: string[]
  error?: string
}

const Select = ({ label, options, error, id, ...props }: SelectProps) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label
          htmlFor={selectId}
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
      )}
      <div style={{ position: 'relative' }}>
        <select
          id={selectId}
          style={{
            width: '100%',
            appearance: 'none',
            padding: '9px 36px 9px 12px',
            borderRadius: '8px',
            border: error
              ? '0.5px solid rgba(255,78,122,0.5)'
              : '0.5px solid rgba(255,255,255,0.08)',
            background: '#0D1120',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            outline: 'none',
            cursor: 'pointer',
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
        >
          {options.map((o) => (
            <option value={o.toLowerCase()} key={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
          }}
        />
      </div>
      {error && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#FF4E7A' }}>
          {error}
        </p>
      )}
    </div>
  )
}

export default Select
