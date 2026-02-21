import { Suspense, useMemo, useState } from 'react'
import {
  calculateMetrics,
  getSpendingByCategory,
  metricsList
} from '../../utils/utils'
import MetricCard from '../metricCard/MetricCard'
import TransactionsList from '../transactions/TransactionsList'
import SpendingChart from '../spendingChart/SpendingChart'
import BudgetOverview from '../budgetOverview/BudgetOverview'
import useFetchQuery from '../../hooks/api/useFetchQuery'
import {
  budgetQueries,
  categoryQueries,
  transactionQueries
} from '../../utils/dataQuery'
import Loading from '../common/Loading'
import {
  type BudgetWithCategory,
  type Category,
  type TransactionWithCategory
} from '../../utils/database.types'
import TransactionFilter from '../filter/TransactionFilter'
import { useAuth } from '../../state/useAuth'
import { useSuspenseQuery } from '@tanstack/react-query'

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth())
  })

  const { user } = useAuth()

  const { data: transactions, isLoading: transactionsLoading } = useFetchQuery<
    TransactionWithCategory[]
  >({
    key: transactionQueries.all(),
    queryFn: transactionQueries.getTransactions
  })

  const { data: categories, isLoading: categoriesLoading } = useFetchQuery<
    Category[]
  >({
    key: categoryQueries.all(),
    queryFn: categoryQueries.getCategories
  })

  const { data: budgetWithSpent } = useSuspenseQuery<BudgetWithCategory[]>({
    queryKey: user
      ? budgetQueries.withSpentBudgets(user, String(selectedDate.getMonth()))
      : [],
    queryFn: () => budgetQueries.getBudgetWithSpent(selectedDate)
  })

  const metrics = useMemo(
    () => calculateMetrics(transactions, budgetWithSpent, selectedDate),
    [transactions, budgetWithSpent, selectedDate]
  )

  const spendingData = useMemo(
    () =>
      getSpendingByCategory(
        categories as Category[],
        transactions as TransactionWithCategory[],
        selectedDate
      ),
    [categories, transactions, selectedDate]
  )

  const metricList = useMemo(() => metricsList(metrics), [metrics])

  const filteredTransactions: TransactionWithCategory[] = useMemo(() => {
    if (!transactions || !Array.isArray(transactions)) return []
    return transactions.filter((tr) => {
      const trDate = new Date(tr.date)
      return (
        trDate.getMonth() === selectedDate.getMonth() &&
        trDate.getFullYear() === selectedDate.getFullYear()
      )
    })
  }, [transactions, selectedDate])

  if (transactionsLoading || categoriesLoading) return <Loading />

  return (
    <>
      <div className='mb-8'>
        <TransactionFilter
          selectedDate={selectedDate}
          onChangeDate={setSelectedDate}
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {metricList.map((m, i: number) => (
          <MetricCard {...m} key={m.title + i} />
        ))}
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
        <div className='lg:col-span-2'>
          <TransactionsList
            selectedDate={selectedDate}
            transactions={filteredTransactions}
          />
        </div>
        <div className='space-y-6 max-h-screen'>
          <SpendingChart data={spendingData} />

          <Suspense fallback={<Loading />}>
            <BudgetOverview budgets={budgetWithSpent as BudgetWithCategory[]} />
          </Suspense>
        </div>
      </div>
    </>
  )
}

export default Dashboard
