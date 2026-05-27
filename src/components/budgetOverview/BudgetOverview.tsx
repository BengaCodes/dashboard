import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { BudgetWithCategory } from '../../types'
import { getPercentage } from '../../utils/utils'
import IconButton from '../common/IconButton'
import Budget from './Budget'
import Modal from '../modal/Modal'
import AddBudgetForm from './AddBudgetForm'
import Card from '../ui/Card'

const BudgetOverview = ({ budgets }: { budgets: BudgetWithCategory[] }) => {
  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <Card padding='none' className='overflow-hidden'>
        <div className='flex items-center justify-between px-5 py-4 border-b border-slate-100'>
          <h2 className='text-base font-semibold text-slate-900'>
            Budget Overview
          </h2>
          <IconButton
            size='sm'
            icon={Plus}
            label='Add budget'
            onClick={() => setOpenModal(true)}
          />
        </div>

        <div className='divide-y divide-slate-50 max-h-72 overflow-y-auto'>
          {budgets.length === 0 ? (
            <div className='py-12 text-center'>
              <p className='text-sm text-slate-400'>No budgets set</p>
              <button
                onClick={() => setOpenModal(true)}
                className='mt-2 text-sm font-medium text-blue-600 hover:text-blue-700'
              >
                Add your first budget →
              </button>
            </div>
          ) : (
            budgets.map((budget) => (
              <div key={budget.id} className='px-5 py-4'>
                <Budget
                  name={budget.categories?.name}
                  percentage={getPercentage(budget.spent, budget.amount)}
                  remaining={budget.amount - budget.spent}
                  bgColor={budget.categories?.color}
                  amount={budget.amount}
                  spent={budget.spent}
                />
              </div>
            ))
          )}
        </div>
      </Card>

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
