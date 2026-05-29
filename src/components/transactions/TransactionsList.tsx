import { useMemo, useState } from 'react'
import { Plus, Upload } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import useMutationQuery from '../../hooks/api/useMutationQuery'
import type { TransactionWithCategory } from '../../types'
import { budgetQueries, transactionQueries } from '../../utils/dataQuery'
import TransactionCell from './TransactionCells'
import IconButton from '../common/IconButton'
import Modal from '../modal/Modal'
import TransactionForm from './AddTransactionForm'
import UploadTransactionsForm from './UploadTransactionsForm'
import { SkeletonRow } from '../ui/Skeleton'
import Card from '../ui/Card'

const FILTER_OPTIONS = ['All', 'Income', 'Expense'] as const

const TransactionsList = ({
  transactions,
  selectedDate
}: {
  transactions: TransactionWithCategory[]
  selectedDate: Date
}) => {
  const [openAdd, setOpenAdd] = useState(false)
  const [openUpload, setOpenUpload] = useState(false)
  const [filterType, setFilterType] = useState<(typeof FILTER_OPTIONS)[number]>('All')

  const queryClient = useQueryClient()

  const filtered = useMemo(() => {
    if (filterType === 'All') return transactions
    return transactions.filter((t) => t.type === filterType.toLowerCase())
  }, [transactions, filterType])

  const { mutation: deleteMutation } = useMutationQuery({
    mutationFn: transactionQueries.deleteTransaction,
    options: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: transactionQueries.all() })
        await queryClient.invalidateQueries({ queryKey: budgetQueries.all() })
      }
    }
  })

  return (
    <>
      <Card padding='none' className='overflow-hidden'>
        <div className='flex items-center justify-between px-5 py-4 border-b border-slate-100'>
          <div className='flex items-center gap-3'>
            <h2 className='text-base font-semibold text-slate-900'>
              Transactions
            </h2>
            <div className='flex rounded-lg border border-slate-200 overflow-hidden text-xs font-medium'>
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilterType(opt)}
                  className={`px-3 py-1.5 transition-colors ${
                    filterType === opt
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className='flex gap-2'>
            <IconButton
              variant='success'
              size='sm'
              onClick={() => setOpenUpload(true)}
              icon={Upload}
              label='Bulk upload'
            />
            <IconButton
              size='sm'
              onClick={() => setOpenAdd(true)}
              icon={Plus}
              label='Add transaction'
            />
          </div>
        </div>

        <div className='divide-y divide-slate-100 max-h-[calc(100vh-320px)] overflow-y-auto'>
          {filtered.length === 0 ? (
            <div className='py-16 text-center'>
              <p className='text-sm text-slate-400'>No transactions yet</p>
            </div>
          ) : (
            filtered.map((tr) => (
              <TransactionCell
                key={tr.id}
                transaction={tr}
                handleDelete={() => deleteMutation.mutate(tr.id)}
              />
            ))
          )}
        </div>
      </Card>

      <Modal
        title='Add Transaction'
        isOpen={openAdd}
        onClose={() => setOpenAdd(false)}
        size='lg'
      >
        <TransactionForm
          selectedDate={selectedDate}
          handleModalClose={() => setOpenAdd(false)}
        />
      </Modal>

      <Modal
        title='Upload Transactions'
        isOpen={openUpload}
        onClose={() => setOpenUpload(false)}
      >
        <UploadTransactionsForm
          handleModalClose={() => setOpenUpload(false)}
        />
      </Modal>
    </>
  )
}

export { SkeletonRow }
export default TransactionsList
