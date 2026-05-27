import { formatAmount } from '../../utils/utils'
import type { Category } from '../../types'
import Progress from '../ui/Progress'

interface ChartItemProps {
  data: {
    category: Category
    amount: number
    percentage: number
  }
}

const ChartItem = ({ data }: ChartItemProps) => (
  <div className='space-y-1.5'>
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <div
          className='w-2.5 h-2.5 rounded-full shrink-0'
          style={{ backgroundColor: data.category.color }}
        />
        <span className='text-sm font-medium text-slate-700'>
          {data.category.name}
        </span>
      </div>
      <div className='flex items-center gap-3'>
        <span className='text-xs text-slate-400'>
          {data.percentage.toFixed(0)}%
        </span>
        <span className='text-sm font-semibold text-slate-800 min-w-16 text-right'>
          {formatAmount(data.amount)}
        </span>
      </div>
    </div>
    <Progress
      value={data.percentage}
      color={data.category.color}
    />
  </div>
)

export default ChartItem
