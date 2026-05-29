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

const Modal = ({ children, isOpen, onClose, title, size = 'md' }: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const modalRoot = document.getElementById('modal-root')
  if (!isOpen || !modalRoot) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  return createPortal(
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal-title'
    >
      <div
        className={`relative w-full ${sizes[size]} bg-white rounded-xl shadow-2xl animate-fade-in`}
      >
        <div className='flex items-center justify-between px-6 py-4 border-b border-slate-200'>
          <h2 id='modal-title' className='text-lg font-semibold text-slate-900'>
            {title}
          </h2>
          <button
            onClick={onClose}
            className='rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors'
            aria-label='Close'
          >
            <X size={18} />
          </button>
        </div>
        <div className='p-6'>{children}</div>
      </div>
    </div>,
    modalRoot
  )
}

export default Modal
