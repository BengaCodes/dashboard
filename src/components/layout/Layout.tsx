import type { ReactNode } from 'react'
import UserInput from '../userInput/userInput'
import { useAuth } from '../../state/useAuth'

const Layout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-50 to-slate-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8 flex justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              Financial Dashboard
            </h1>
            <p className='text-gray-600'>
              Track your income, expenses, and budgets
            </p>
          </div>
          {user && <UserInput />}
        </div>
        {children}
      </div>
    </div>
  )
}

export default Layout
