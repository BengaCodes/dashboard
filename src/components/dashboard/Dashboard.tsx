import { Suspense, useMemo, useState } from 'react'
import { useSuspenseQuery, useQuery } from '@tanstack/react-query'
import {
  calculateMetrics,
  getSpendingByCategory,
  metricsList
} from '../../utils/utils'
import MetricCard from '../metricCard/MetricCard'
import TransactionsList from '../transactions/TransactionsList'
import SpendingChart from '../spendingChart/SpendingChart'
import BudgetOverview from '../budgetOverview/BudgetOverview'
import { budgetQueries, categoryQueries, transactionQueries } from '../../utils/dataQuery'
import type { BudgetWithCategory, Category, TransactionWithCategory } from '../../types'
import TransactionFilter from '../filter/TransactionFilter'
import { useAuth } from '../../state/useAuth'
import { SkeletonCard } from '../ui/Skeleton'

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth())
  )
  const { user } = useAuth()

  const { data: transactions = [] } = useQuery<TransactionWithCategory[]>({
    queryKey: transactionQueries.all(),
    queryFn: transactionQueries.getTransactions
  })

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: categoryQueries.all(),
    queryFn: categoryQueries.getCategories
  })

  const { data: budgetWithSpent = [] } = useSuspenseQuery<BudgetWithCategory[]>({
    queryKey: user
      ? budgetQueries.withSpentBudgets(user.id, String(selectedDate.getMonth()))
      : ['budgets-no-user'],
    queryFn: () => budgetQueries.getBudgetWithSpent(selectedDate)
  })

  const filteredTransactions = useMemo(() => {
    const m = selectedDate.getMonth()
    const y = selectedDate.getFullYear()
    return transactions.filter((t) => {
      const d = new Date(t.date)
      return d.getMonth() === m && d.getFullYear() === y
    })
  }, [transactions, selectedDate])

  const metrics = useMemo(
    () => calculateMetrics(transactions, budgetWithSpent, selectedDate),
    [transactions, budgetWithSpent, selectedDate]
  )

  const spendingData = useMemo(
    () => getSpendingByCategory(categories, transactions, selectedDate),
    [categories, transactions, selectedDate]
  )

  const cards = useMemo(() => metricsList(metrics), [metrics])

  return (
    <div className='space-y-6'>
      <TransactionFilter
        selectedDate={selectedDate}
        onChangeDate={setSelectedDate}
      />

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {cards.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <TransactionsList
            selectedDate={selectedDate}
            transactions={filteredTransactions}
          />
        </div>
        <div className='flex flex-col gap-6'>
          <SpendingChart data={spendingData} />
          <Suspense fallback={<SkeletonCard />}>
            <BudgetOverview budgets={budgetWithSpent} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
