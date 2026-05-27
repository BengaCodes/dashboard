import React from 'react'
import type { LucideIcon } from 'lucide-react'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const IconButton = ({
  icon: Icon,
  variant = 'primary',
  size = 'md',
  label,
  className = '',
  ...props
}: IconButtonProps) => {
  const base =
    'inline-flex items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

  const variants = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    secondary:
      'bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-400',
    ghost:
      'bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    success:
      'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500'
  }

  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  }

  const iconSizes = { sm: 14, md: 18, lg: 22 }

  return (
    <button
      aria-label={label}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <Icon size={iconSizes[size]} />
    </button>
  )
}

export default IconButton
