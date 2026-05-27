import React, { type ReactNode } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const Button = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

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
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base'
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
