import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ModalProps = {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const MAX_WIDTHS = {
  sm: '380px',
  md: '520px',
  lg: '700px',
  xl: '920px',
}

const Modal = ({ children, isOpen, onClose, title, size = 'md' }: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const modalRoot = document.getElementById('modal-root')
  if (!isOpen || !modalRoot) return null

  return createPortal(
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal-title'
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(7,10,18,0.85)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        className='animate-fade-in'
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: MAX_WIDTHS[size],
          background: '#111626',
          border: '0.5px solid rgba(255,255,255,0.10)',
          borderRadius: '16px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            borderBottom: '0.5px solid rgba(255,255,255,0.06)',
          }}
        >
          <h2
            id='modal-title'
            style={{
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
              fontSize: '16px',
              color: 'var(--color-text-primary)',
              margin: 0,
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label='Close'
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              transition: 'background 150ms ease, color 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.color = 'var(--color-text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--color-text-muted)'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>,
    modalRoot
  )
}

export default Modal
