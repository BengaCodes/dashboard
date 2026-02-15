import { useQueryClient } from '@tanstack/react-query'
import useMutationQuery from '../../hooks/api/useMutationQuery'
import type { TransactionWithCategory } from '../../utils/database.types'
import { transactionQueries } from '../../utils/dataQuery'
import TransactionCell from './TransactionCells'
import IconButton from '../common/IconButton'
import { Plus, Upload } from 'lucide-react'
import { useMemo, useState } from 'react'
import Modal from '../modal/Modal'
import TransactionForm from './AddTransactionForm'
import UploadTransactionsForm from './UploadTransactionsForm'

const TransactionsList = ({
  transactions
}: {
  transactions: TransactionWithCategory[]
}) => {
  const [openModal, setOpenModal] = useState(false)
  const [openBulkUploadModal, setOpenBulkUploadModal] = useState(false)
  const [filterType, setFilterType] = useState('All')

  const filteredTransactions = useMemo(() => {
    if (filterType === 'All') return transactions
    return transactions.filter((x) => x.type === filterType.toLowerCase())
  }, [transactions, filterType])

  const queryClient = useQueryClient()

  const { mutation: deleteMutation } = useMutationQuery({
    mutationFn: transactionQueries.deleteTransaction,
    options: {
      onSuccess: async () =>
        await queryClient.invalidateQueries({
          queryKey: transactionQueries.all()
        }),
      onError: (error) => {
        console.log({ error })
      }
    }
  })

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  return (
    <>
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
        <div className='p-4 border-b border-gray-100 flex justify-between'>
          <div className='flex gap-4 justify-center items-center'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Recent Transactions
            </h2>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className='px-3 py-2 rounded-lg border border-gray-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              {['All', 'Income', 'Expense'].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className='flex justify-between gap-4'>
            <IconButton
              variant='emerald'
              onClick={() => setOpenBulkUploadModal(true)}
              icon={Upload}
            />
            <IconButton onClick={handleOpenModal} icon={Plus} />
          </div>
        </div>
        <div className='divide-y divide-gray-100 max-h-screen overflow-y-auto'>
          {filteredTransactions?.length === 0 ? (
            <div className='p-8 text-center text-gray-500'>
              No transactions yet
            </div>
          ) : (
            filteredTransactions.map((tr: TransactionWithCategory) => (
              <TransactionCell
                key={tr.id}
                transaction={tr}
                handleDelete={() => deleteMutation.mutate(tr.id)}
              />
            ))
          )}
        </div>
      </div>
      <Modal
        title='Add Transaction'
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      >
        <TransactionForm handleModalClose={() => setOpenModal(false)} />
      </Modal>
      <Modal
        title='Upload Transactions'
        isOpen={openBulkUploadModal}
        onClose={() => setOpenBulkUploadModal(false)}
      >
        <UploadTransactionsForm
          label='Upload Transactions'
          note='        Please upload an Excel file (.xlsx, .xls) containing the following
        fields: Amount, Description, Date, Category_id and Type (income/expense).'
          handleModalClose={() => setOpenBulkUploadModal(false)}
        />
      </Modal>
    </>
  )
}

export default TransactionsList
