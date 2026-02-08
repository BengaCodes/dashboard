import { getPercentage } from '../../utils'
import Budget from './Budget'

/* eslint-disable @typescript-eslint/no-explicit-any */
const BudgetOverview = ({ budgets }: { budgets: any }) => {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
      <h2 className='text-lg font-semibold text-gray-900 mb-6'>
        Budget Overview
      </h2>
      <div className='space-y-5'>
        {budgets.length === 0 ? (
          <div className='text-center text-gray-500 py-8'>No budgets set</div>
        ) : (
          budgets.map((budget: any, i: number) => (
            <Budget
              key={budget.categories.name + i}
              name={budget.categories.name}
              percentage={getPercentage(budget.spent, budget.amount)}
              remaining={budget.amount - budget.spent}
              bgColor={budget.categories.color}
              amount={budget.amount}
              spent={budget.spent}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default BudgetOverview
