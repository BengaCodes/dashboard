import React, { type ReactNode } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  iconClassName?: string
  ref?: React.Ref<HTMLButtonElement>
  children: ReactNode
}

const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  ref,
  children,
  ...props
}: ButtonProps) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  }

  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  }

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
