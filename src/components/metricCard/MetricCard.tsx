import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  change: string
  changeType?: string
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
  const changeColorClass = {
    positive: 'text-emerald-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }[changeType]

  return (
    <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <p className='text-sm font-medium text-gray-600 mb-1'>{title}</p>
          <p className='text-3x font-bold text-gray-900 mb-2'>{value}</p>
          {change && (
            <p className={`text-sm font-medium ${changeColorClass}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconColor}`}>
          <Icon className='w-6 h-6 text-white' />
        </div>
      </div>
    </div>
  )
}

export default MetricCard
