import * as Icons from 'lucide-react'
import { useState } from 'react'
import { formatAmount, formatDate } from '../../utils/utils'
import { Icon } from '../common/Icons'
import type { TransactionWithCategory } from '../../types'
import IconButton from '../common/IconButton'
import Modal from '../modal/Modal'
import Button from '../common/Button'

type TransactionCellProps = {
  transaction: TransactionWithCategory
  handleDelete: () => void
}

const TransactionCell = ({ transaction, handleDelete }: TransactionCellProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const isIncome = transaction.type === 'income'
  const category = transaction.categories

  return (
    <>
      <div className='px-5 py-3.5 hover:bg-slate-50 transition-colors'>
        <div className='flex items-center gap-4'>
          <div
            className='shrink-0 w-10 h-10 rounded-xl flex items-center justify-center'
            style={{ backgroundColor: `${category?.color}20` }}
          >
            <Icon
              iconName={category?.icon || 'DollarSign'}
              className='w-5 h-5'
              style={{ color: category?.color }}
            />
          </div>

          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-slate-900 truncate'>
              {transaction.description}
            </p>
            <p className='text-xs text-slate-500 mt-0.5'>
              {category?.name || 'Uncategorised'}
              <span className='mx-1.5 text-slate-300'>•</span>
              {formatDate(transaction.date)}
              {transaction.recurring && (
                <>
                  <span className='mx-1.5 text-slate-300'>•</span>
                  <span className='text-blue-500 font-medium'>Recurring</span>
                </>
              )}
            </p>
          </div>

          <div className='flex items-center gap-3 shrink-0'>
            <div className='flex items-center gap-1'>
              <span
                className={`text-sm font-semibold ${isIncome ? 'text-emerald-600' : 'text-slate-800'}`}
              >
                {formatAmount(transaction.amount, transaction.type)}
              </span>
              {isIncome ? (
                <Icons.ArrowUpRight size={14} className='text-emerald-500' />
              ) : (
                <Icons.ArrowDownRight size={14} className='text-red-400' />
              )}
            </div>
            <IconButton
              icon={Icons.Trash2}
              variant='ghost'
              size='sm'
              label='Delete transaction'
              onClick={() => setShowDeleteModal(true)}
              className='text-slate-400 hover:text-red-600 hover:bg-red-50'
            />
          </div>
        </div>
      </div>

      <Modal
        title='Delete Transaction'
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        size='sm'
      >
        <div className='space-y-4'>
          <p className='text-sm text-slate-600'>
            Are you sure you want to delete{' '}
            <span className='font-medium text-slate-900'>
              "{transaction.description}"
            </span>
            ? This cannot be undone.
          </p>
          <div className='flex justify-end gap-3'>
            <Button
              variant='secondary'
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant='danger'
              onClick={() => {
                handleDelete()
                setShowDeleteModal(false)
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default TransactionCell
