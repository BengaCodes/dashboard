import type { TransactionWithCategory } from '../../utils/database.types'
import TransactionCell from './TransactionCells'

const TransactionsList = ({
  transactions
}: {
  transactions: TransactionWithCategory[]
}) => {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
      <div className='p-6 border-b border-gray-100'>
        <h2 className='text-lg font-semibold text-gray-900'>
          Recent Transactions
        </h2>
      </div>
      <div className='divide-y divide-gray-100'>
        {transactions?.length === 0 ? (
          <div className='p-8 text-center text-gray-500'>
            No transactions yet
          </div>
        ) : (
          transactions.map((tr: TransactionWithCategory) => (
            <TransactionCell key={tr.id} transaction={tr} />
          ))
        )}
      </div>
    </div>
  )
}

export default TransactionsList
