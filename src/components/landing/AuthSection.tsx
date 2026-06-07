import { useState } from 'react'
import { useAuth } from '../../state/useAuth'
import { SECTION_BORDER, MAX_W } from './landingConstants'

const inputStyle: React.CSSProperties = {
  width:        '100%',
  padding:      '10px 14px',
  borderRadius: '9px',
  border:       '0.5px solid rgba(255,255,255,0.1)',
  background:   'rgba(255,255,255,0.04)',
  color:        'var(--color-text-primary)',
  fontFamily:   'var(--font-mono)',
  fontSize:     '14px',
  outline:      'none',
  transition:   'border-color 150ms ease',
}

const AuthSection = ({
  mode,
  onModeChange,
}: {
  mode:         'signin' | 'signup'
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
      const raw = err instanceof Error ? err.message : 'Something went wrong'
      setError(/fetch|network|Failed to fetch/i.test(raw)
        ? 'Unable to connect. Please check your connection and try again.'
        : raw === 'Unauthorized' ? 'Invalid email or password.'
        : raw)
    } finally {
      setPending(false)
    }
  }

  const focusTeal = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'rgba(77,255,195,0.4)'
  }
  const blurDefault = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
  }

  return (
    <section id='auth' style={{ borderTop: SECTION_BORDER }}>
      <div style={{ ...MAX_W, padding: '96px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 'clamp(24px, 3.5vw, 38px)', letterSpacing: '-1px', color: 'var(--color-text-primary)', margin: 0 }}>
            {mode === 'signup' ? 'Create your free account' : 'Welcome back'}
          </h2>
        </div>

        <div style={{ width: '100%', maxWidth: '420px', background: 'var(--color-bg-surface)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>

          {/* Tab switcher */}
          <div style={{ display: 'flex', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
            {(['signin', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => { onModeChange(m); setError('') }}
                style={{
                  flex:        1,
                  padding:     '14px',
                  border:      'none',
                  cursor:      'pointer',
                  fontFamily:  'var(--font-ui)',
                  fontWeight:  mode === m ? 600 : 400,
                  fontSize:    '14px',
                  background:  mode === m ? 'rgba(77,255,195,0.06)' : 'transparent',
                  color:       mode === m ? '#4DFFC3' : 'var(--color-text-muted)',
                  borderBottom:mode === m ? '1.5px solid #4DFFC3' : '1.5px solid transparent',
                  transition:  'all 150ms ease',
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
              <input type='email' required autoComplete='email' placeholder='you@example.com' value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurDefault} />
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                Password
              </label>
              <input type='password' required placeholder='••••••••' autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurDefault} />
            </div>

            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                  Confirm password
                </label>
                <input type='password' required autoComplete='new-password' placeholder='••••••••' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurDefault} />
              </div>
            )}

            <button
              type='submit'
              disabled={pending}
              style={{ padding: '12px', borderRadius: '9px', border: 'none', background: '#4DFFC3', color: '#0B0F1A', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '14px', cursor: pending ? 'not-allowed' : 'pointer', opacity: pending ? 0.7 : 1, transition: 'opacity 150ms ease', marginTop: '4px' }}
              onMouseEnter={e => { if (!pending) e.currentTarget.style.opacity = '0.88' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = pending ? '0.7' : '1' }}
            >
              {pending ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>

            {error && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                padding: '12px 14px', borderRadius: '9px',
                background: 'rgba(255,78,122,0.12)',
                border: '1px solid rgba(255,78,122,0.4)',
                animation: 'fadeIn 150ms ease both',
              }}>
                <span style={{ color: '#FF4E7A', fontSize: '14px', lineHeight: 1, flexShrink: 0, marginTop: '1px' }}>✕</span>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#FF4E7A', lineHeight: 1.5 }}>{error}</p>
              </div>
            )}

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

export default AuthSection
