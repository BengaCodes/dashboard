import { Plus } from 'lucide-react'
import type { BudgetWithCategory } from '../../utils/database.types'
import { getPercentage } from '../../utils/utils'
import IconButton from '../common/IconButton'
import Budget from './Budget'
import Modal from '../modal/Modal'
import { useState } from 'react'
import AddBudgetForm from './AddBudgetForm'

const BudgetOverview = ({ budgets }: { budgets: BudgetWithCategory[] }) => {
  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
        <div className=' mb-6 border-b border-gray-100 flex justify-between align-middle'>
          <h2 className='text-lg font-semibold text-gray-900 mb-6'>
            Budget Overview
          </h2>
          <div>
            <IconButton
              size='sm'
              icon={Plus}
              onClick={() => setOpenModal(true)}
              className=' cursor-pointer'
            />
          </div>
        </div>
        <div className='space-y-5'>
          {budgets.length === 0 ? (
            <div className='text-center text-gray-500 py-8'>No budgets set</div>
          ) : (
            budgets.map((budget: BudgetWithCategory) => (
              <Budget
                key={budget.id}
                name={budget.categories?.name}
                percentage={getPercentage(budget.spent, budget.amount)}
                remaining={budget.amount - budget.spent}
                bgColor={budget.categories?.color}
                amount={budget.amount}
                spent={budget.spent}
              />
            ))
          )}
        </div>
      </div>
      <Modal
        title='Add Budget'
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      >
        <AddBudgetForm handleModalClose={() => setOpenModal(false)} />
      </Modal>
    </>
  )
}

export default BudgetOverview
