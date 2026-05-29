import type { ReactNode } from 'react'
import UserInput from '../userInput/userInput'
import { useAuth } from '../../state/useAuth'
import FintraxxLogo from '../common/FintraxxLogo'

const Layout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {user && (
          <header className='mb-8 flex items-start justify-between'>
            <div>
              <FintraxxLogo className='mb-1' />
              <p className='text-sm text-slate-500 ml-1'>
                Track your income, expenses, and budgets
              </p>
            </div>
            <UserInput />
          </header>
        )}
        <main>{children}</main>
      </div>
    </div>
  )
}

export default Layout
