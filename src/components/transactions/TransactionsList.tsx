import { useQueryClient } from '@tanstack/react-query'
import useMutationQuery from '../../hooks/api/useMutationQuery'
import type {
  Category,
  TransactionWithCategory
} from '../../utils/database.types'
import { categoryQueries, transactionQueries } from '../../utils/dataQuery'
import TransactionCell from './TransactionCells'
import IconButton from '../common/IconButton'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import Modal from '../modal/Modal'
import TransactionForm from './AddTransactionForm'

const TransactionsList = ({
  transactions
}: {
  transactions: TransactionWithCategory[]
}) => {
  const [openModal, setOpenModal] = useState(false)

  const queryClient = useQueryClient()

  const categories = queryClient.getQueryData<Category[]>(categoryQueries.all())

  const { mutation } = useMutationQuery({
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
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4'>
        <div className='p-4 border-b border-gray-100 flex justify-between'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Recent Transactions
          </h2>
          <IconButton onClick={handleOpenModal} icon={Plus} />
        </div>
        <div className='divide-y divide-gray-100'>
          {transactions?.length === 0 ? (
            <div className='p-8 text-center text-gray-500'>
              No transactions yet
            </div>
          ) : (
            transactions.map((tr: TransactionWithCategory) => (
              <TransactionCell
                key={tr.id}
                transaction={tr}
                handleDelete={() => mutation.mutate(tr.id)}
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
        <TransactionForm categories={categories ?? []} />
      </Modal>
    </>
  )
}

export default TransactionsList
