import { LogOut, User, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../state/useAuth'

const UserInput = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignout = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  return (
    <div className='relative' ref={ref}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className='flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white hover:shadow-sm transition-all text-slate-600'
        aria-expanded={isOpen}
        aria-haspopup='true'
      >
        <span className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700'>
          <User size={16} />
        </span>
        <span className='hidden sm:block text-sm font-medium text-slate-700 max-w-40 truncate'>
          {user?.email}
        </span>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-lg border border-slate-100 z-50 overflow-hidden animate-fade-in'>
          <div className='px-4 py-3 border-b border-slate-100'>
            <p className='text-xs text-slate-500 mb-0.5'>Signed in as</p>
            <p className='text-sm font-medium text-slate-900 truncate'>
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleSignout}
            className='w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left'
          >
            <LogOut size={15} className='text-slate-400' />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default UserInput
