import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  change: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  iconColor: string
}

const MetricCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor
}: MetricCardProps) => {
  const changeColors = {
    positive: 'text-emerald-600',
    negative: 'text-red-600',
    neutral: 'text-slate-500'
  }

  return (
    <div className='bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-medium text-slate-500 mb-1'>{title}</p>
          <p className='text-2xl font-bold text-slate-900 mb-1 truncate'>
            {value}
          </p>
          <p className={`text-xs font-medium ${changeColors[changeType]}`}>
            {change}
          </p>
        </div>
        <div className={`shrink-0 p-3 rounded-xl ${iconColor}`}>
          <Icon className='w-5 h-5 text-white' />
        </div>
      </div>
    </div>
  )
}

export default MetricCard
