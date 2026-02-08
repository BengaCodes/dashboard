import { useMemo } from 'react'
import { calculateMetrics, metricsList } from '../../utils'
import MetricCard from '../metricCard/MetricCard'
import TransactionsList from '../transactions/TransactionsList'
import SpendingChart from '../spendingChart/SpendingChart'
import BudgetOverview from '../budgetOverview/BudgetOverview'

const Dashboard = () => {
  const metrics = useMemo(() => calculateMetrics([], []), [])

  const metricList = useMemo(() => metricsList(metrics), [metrics])

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-50 to-slate-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Financial Dashboard
          </h1>
          <p className='text-gray-600'>
            Track your income, expenses, and budgets
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {metricList.map((m, i: number) => (
            <MetricCard {...m} key={m.title + i} />
          ))}
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
          <div className='lg:col-span-2'>
            <TransactionsList transactions={[]} />
          </div>
          <div className='space-y-6'>
            <SpendingChart data={[]} />
            <BudgetOverview budgets={[]} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
