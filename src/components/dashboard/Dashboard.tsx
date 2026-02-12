import { Suspense, useMemo } from 'react'
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

const Dashboard = () => {
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

  const { data: budgetWithSpent, isLoading: budgetsLoading } = useFetchQuery<
    BudgetWithCategory[]
  >({
    key: budgetQueries.all(),
    queryFn: budgetQueries.getBudgetWithSpent
  })

  const metrics = useMemo(
    () => calculateMetrics(transactions, budgetWithSpent),
    [transactions, budgetWithSpent]
  )

  const spendingData = useMemo(
    () =>
      getSpendingByCategory(
        categories as Category[],
        transactions as TransactionWithCategory[]
      ),
    [categories, transactions]
  )

  const metricList = useMemo(() => metricsList(metrics), [metrics])

  if (transactionsLoading || budgetsLoading || categoriesLoading)
    return <Loading />

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {metricList.map((m, i: number) => (
          <MetricCard {...m} key={m.title + i} />
        ))}
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
        <div className='lg:col-span-2'>
          <Suspense fallback={'Loading Transactions'}>
            <TransactionsList
              transactions={transactions as TransactionWithCategory[]}
            />
          </Suspense>
        </div>
        <div className='space-y-6'>
          <Suspense fallback={'Loading spend chart'}>
            <SpendingChart data={spendingData} />
          </Suspense>
          <Suspense fallback={'Loading budgets'}>
            <BudgetOverview budgets={budgetWithSpent as BudgetWithCategory[]} />
          </Suspense>
        </div>
      </div>
    </>
  )
}

export default Dashboard
