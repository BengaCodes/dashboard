import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

const Card = ({ children, className = '', hover = false, padding = 'md' }: CardProps) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <div
      className={`
        bg-white rounded-xl border border-slate-100 shadow-sm
        ${hover ? 'hover:shadow-md transition-shadow' : ''}
        ${paddings[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  action?: ReactNode
  className?: string
}

const CardHeader = ({ children, action, className = '' }: CardHeaderProps) => (
  <div className={`flex items-center justify-between pb-4 mb-4 border-b border-slate-100 ${className}`}>
    <div>{children}</div>
    {action && <div>{action}</div>}
  </div>
)

interface CardTitleProps {
  children: ReactNode
  className?: string
}

const CardTitle = ({ children, className = '' }: CardTitleProps) => (
  <h2 className={`text-lg font-semibold text-slate-900 ${className}`}>
    {children}
  </h2>
)

Card.Header = CardHeader
Card.Title = CardTitle

export default Card
