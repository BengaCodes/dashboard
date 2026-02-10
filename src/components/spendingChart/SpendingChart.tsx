/* eslint-disable @typescript-eslint/no-explicit-any */

import { formatAmount } from '../../utils/utils'
import ChartItem from './ChartItem'

interface SpendingChartProps {
  data: {
    category: any
    amount: number
    percentage: number
  }[]
}

const SpendingChart = ({ data }: SpendingChartProps) => {
  const total = data.reduce((acc, cur) => acc + cur.amount, 0)

  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
      <h2 className='text-lg font-semibold text-gray-900 mb-6'>
        Spending by Category
      </h2>

      <div className='space-y-4'>
        {data.length === 0 ? (
          <div className='text-center text-gray-500 py-8'>
            No spending data available
          </div>
        ) : (
          data.map((item, i) => (
            <ChartItem data={item} key={item.category + i} />
          ))
        )}
        {data.length > 0 && (
          <div className='mt-6 pt-6 border-t border-gray-100'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-gray-700'>
                Total Spending
              </span>
              <span className='text-lg font-bold text-gray-900'>
                {formatAmount(total)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SpendingChart
