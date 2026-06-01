import type { ReactNode } from 'react'
import Navbar from './Navbar'
import { useAuth } from '../../state/useAuth'

const Layout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>
      {user && <Navbar />}
      <main
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '32px 24px',
        }}
      >
        {children}
      </main>
    </div>
  )
}

export default Layout
