import type { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
  return <div className='text-stone-950 bg-stone-100'>{children}</div>
}

export default Layout
