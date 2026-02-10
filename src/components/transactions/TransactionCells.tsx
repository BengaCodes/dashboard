import * as Icons from 'lucide-react'
import { formatAmount, formatDate } from '../../utils/utils'
import { Icon } from '../common/Icons'
import type { TransactionWithCategory } from '../../utils/database.types'

const TransactionCell = ({
  transaction
}: {
  transaction: TransactionWithCategory
}) => {
  const isIncome = transaction.type === 'income'

  return (
    <div className='p-4 hover:bg-gray-50 transition-colors'>
      <div className='flex items-center gap-4'>
        <div
          className='p-2 rounded-lg'
          style={{ backgroundColor: `${transaction.category?.color}15` }}
        >
          <Icon
            iconName={transaction.category?.icon}
            className='w-5 h-5'
            style={{ color: transaction.category?.color }}
          />
        </div>
        <div className='flex-1 min-w-0'>
          <p className='font-medium text-gray-900 truncate'>
            {transaction?.description}
          </p>
          <div className='flex items-center gap-2 mt-0 5'>
            <p className='text-sm text-gray-500'>
              {transaction.category?.name || 'Uncategorised'}
            </p>
            <span className='text-gray-300'>•</span>
            <p className='text-sm text-gray-500'>
              {formatDate(transaction.date)}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <span className='text-lg font-semibold'>
            {formatAmount(transaction.amount, transaction.type)}
          </span>
          {isIncome ? (
            <Icons.ArrowUpRight className='w-4 h-4 text-emerald-600' />
          ) : (
            <Icons.ArrowDownRight className='w-4 h-4 text-red-600' />
          )}
        </div>
      </div>
    </div>
  )
}

export default TransactionCell
