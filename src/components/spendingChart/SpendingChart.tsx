import { formatAmount } from '../../utils/utils'
import type { Category } from '../../types'
import ChartItem from './ChartItem'
import Card from '../ui/Card'

interface SpendingChartProps {
  data: {
    category: Category
    amount: number
    percentage: number
  }[]
}

const SpendingChart = ({ data }: SpendingChartProps) => {
  const total = data.reduce((acc, cur) => acc + cur.amount, 0)

  return (
    <Card padding='none' className='overflow-hidden'>
      <div className='px-5 py-4 border-b border-slate-100'>
        <h2 className='text-base font-semibold text-slate-900'>
          Spending by Category
        </h2>
      </div>

      <div className='px-5 py-4 space-y-4 max-h-80 overflow-y-auto'>
        {data.length === 0 ? (
          <div className='py-8 text-center'>
            <p className='text-sm text-slate-400'>No spending this month</p>
          </div>
        ) : (
          <>
            {data.map((item, i) => (
              <ChartItem key={item.category.id ?? i} data={item} />
            ))}
            <div className='pt-3 mt-3 border-t border-slate-100 flex items-center justify-between'>
              <span className='text-sm font-medium text-slate-600'>
                Total spending
              </span>
              <span className='text-sm font-bold text-slate-900'>
                {formatAmount(total)}
              </span>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}

export default SpendingChart
