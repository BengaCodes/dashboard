import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react'
import type { ReactNode } from 'react'

type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

interface AlertProps {
  children: ReactNode
  variant?: AlertVariant
  title?: string
  className?: string
}

const configs: Record<AlertVariant, { icon: typeof Info; classes: string }> = {
  info: { icon: Info, classes: 'bg-blue-50 border-blue-200 text-blue-800' },
  success: { icon: CheckCircle2, classes: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  warning: { icon: AlertCircle, classes: 'bg-amber-50 border-amber-200 text-amber-800' },
  danger: { icon: XCircle, classes: 'bg-red-50 border-red-200 text-red-800' }
}

const Alert = ({ children, variant = 'info', title, className = '' }: AlertProps) => {
  const { icon: Icon, classes } = configs[variant]

  return (
    <div className={`flex gap-3 rounded-lg border p-4 text-sm ${classes} ${className}`} role='alert'>
      <Icon size={16} className='mt-0.5 shrink-0' />
      <div>
        {title && <p className='font-semibold mb-0.5'>{title}</p>}
        <p>{children}</p>
      </div>
    </div>
  )
}

export default Alert
