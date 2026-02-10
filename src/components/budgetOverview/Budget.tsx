import { formatAmount, getStatus } from '../../utils/utils'

interface BudgetProps {
  percentage: number
  remaining: number
  bgColor: string
  name: string
  spent: number
  amount: number
}

const Budget = ({
  percentage,
  remaining,
  bgColor,
  name,
  spent,
  amount
}: BudgetProps) => {
  const status = getStatus(percentage)
  const StatusIcon = status?.icon

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div
            className='w-3 h-3 rounded-full'
            style={{ backgroundColor: bgColor }}
          />
          <span className='text-sm font-medium text-gray-900'>{name}</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className={`p-1 rounded ${status.bg}`}>
            <StatusIcon className={`w-3 h-3 ${status.color}`} />
          </div>
        </div>

        <div className='space-y-2'>
          <div className='w-full bg-gray-100 rounded-full h-2 overflow-hidden'>
            <div
              className='h-full rounded-full transition-all duration-500 ease-out'
              style={{ width: `${percentage}%`, backgroundColor: bgColor }}
            />
          </div>
          <div className='flex items-center justify-between text-xs'>
            <span className='text-gray-600'>
              <span className='font-semibold text-gray-900'>
                {formatAmount(spent)}
              </span>{' '}
              of {formatAmount(amount)}
            </span>
            <span
              className={
                remaining >= 0
                  ? 'text-emerald-600 font-medium'
                  : 'text-red-600 font-medium'
              }
            >
              {remaining >= 0
                ? formatAmount(remaining)
                : `${formatAmount(Math.abs(remaining))} over`}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Budget
