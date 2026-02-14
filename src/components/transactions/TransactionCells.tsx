import * as Icons from 'lucide-react'
import { formatAmount, formatDate } from '../../utils/utils'
import { Icon } from '../common/Icons'
import type { TransactionWithCategory } from '../../utils/database.types'
import IconButton from '../common/IconButton'
import Modal from '../modal/Modal'
import { useState } from 'react'
import Button from '../common/Button'

type TransactionCellProps = {
  transaction: TransactionWithCategory
  handleDelete: () => void
}

const TransactionCell = ({
  transaction,
  handleDelete
}: TransactionCellProps) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const isIncome = transaction.type === 'income'

  return (
    <>
      <div className='p-4 hover:bg-gray-50 transition-colors'>
        <div className='flex items-center gap-4'>
          <div
            className='p-2 rounded-lg'
            style={{ backgroundColor: `${transaction.categories.color}15` }}
          >
            <Icon
              iconName={transaction.categories?.icon}
              className='w-5 h-5'
              style={{ color: transaction.categories?.color }}
            />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='font-medium text-gray-900 truncate'>
              {transaction?.description}
            </p>
            <div className='flex items-center gap-2 mt-0 5'>
              <p className='text-sm text-gray-500'>
                {transaction.categories?.name || 'Uncategorised'}
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
            <IconButton
              icon={Icons.Trash2}
              variant='danger'
              onClick={() => setOpenDeleteModal(true)}
            />
          </div>
        </div>
      </div>
      <Modal
        title={`${transaction.description}`}
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      >
        <div className='w-3/4'>
          <p className=' mb-4'>Are you sure you want to delete transaction?</p>
          <div className='flex justify-end gap-2'>
            <Button
              onClick={() => setOpenDeleteModal(false)}
              className=' cursor-pointer'
              variant='danger'
            >
              Cancel
            </Button>
            <Button onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default TransactionCell
