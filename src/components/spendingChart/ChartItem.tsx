/* eslint-disable @typescript-eslint/no-explicit-any */

import { formatAmount } from '../../utils/utils'

const ChartItem = ({ data }: { data: any }) => {
  return (
    <div key={data.category.id} className='space-y-2'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div
            className='w-3 h-3 rounded-full'
            style={{ backgroundColor: data.category.color }}
          />
          <span className='text-sm font-medium text-gray-700'>
            {data.category.name}
          </span>
        </div>
        <div className='flex items-center gap-3'>
          <span className='text-sm text-gray-500'>
            {data.percentage.toFixed(0)}%
          </span>
          <span className='text-sm font-semibold text-gray-900 min-w-20 text-right'>
            {formatAmount(data.amount)}
          </span>
        </div>
      </div>
      <div className='w-full bg-gray-100 rounded-full h-2 overflow-hidden'>
        <div
          className='h-full rounded-full transition-all duration-500 ease-out'
          style={{
            width: `${data.percentage}%`,
            backgroundColor: data.category.color
          }}
        />
      </div>
    </div>
  )
}

export default ChartItem
