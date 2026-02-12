import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ModalProps = {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  size = 'md'
}: ModalProps) => {
  const modalRoot = document.getElementById('modal-root')!

  if (!isOpen || !modalRoot) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return createPortal(
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200'
      onClick={handleBackdropClick}
      // onKeyDown={handleKeyDown}
      role='dialog'
      aria-modal='true'
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={`relative w-full ${sizes[size]} bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-200`}
      >
        {title && (
          <div className='flex items-center justify-between p-6 border-b border-gray-200'>
            {title && (
              <h2
                id='modal-title'
                className='text-xl font-semibold text-gray-900'
              >
                {title}
              </h2>
            )}

            <button
              onClick={onClose}
              className='p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100'
              aria-label='Close modal'
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className='p-6'>{children}</div>
      </div>
    </div>,
    modalRoot
  )
}

export default Modal
