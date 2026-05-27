import { formatAmount, getStatus } from '../../utils/utils'
import Progress from '../ui/Progress'

interface BudgetProps {
  percentage: number
  remaining: number
  bgColor: string
  name: string
  spent: number
  amount: number
}

const Budget = ({ percentage, remaining, bgColor, name, spent, amount }: BudgetProps) => {
  const status = getStatus(percentage)
  const StatusIcon = status.icon
  const isOver = remaining < 0

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div
            className='w-2.5 h-2.5 rounded-full shrink-0'
            style={{ backgroundColor: bgColor }}
          />
          <span className='text-sm font-medium text-slate-800'>{name}</span>
        </div>
        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md ${status.bg}`}>
          <StatusIcon size={11} className={status.color} />
          <span className={`text-xs font-medium ${status.color}`}>
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>

      <Progress value={percentage} color={bgColor} />

      <div className='flex justify-between text-xs'>
        <span className='text-slate-500'>
          <span className='font-semibold text-slate-800'>{formatAmount(spent)}</span>
          {' '}of {formatAmount(amount)}
        </span>
        <span className={isOver ? 'text-red-600 font-medium' : 'text-emerald-600 font-medium'}>
          {isOver
            ? `${formatAmount(Math.abs(remaining))} over`
            : `${formatAmount(remaining)} left`}
        </span>
      </div>
    </div>
  )
}

export default Budget
