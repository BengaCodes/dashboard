import { LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../state/useAuth'

const UserInput = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()

  const handleSignout = async () => {
    try {
      await signOut()
      setIsOpen(false)
    } catch (error) {
      console.error('Sign out error: ', error)
    }
  }

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors'
      >
        <User className=' w-5 h-5 text-gray-600' />
        <span className='text-sm font-medium text-gray-700'>{user?.email}</span>
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50'>
          <button
            onClick={handleSignout}
            className='w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-left rounded-lg'
          >
            <LogOut className='w-4 h-4' />
            <span className='text-sm font-medium'>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default UserInput
