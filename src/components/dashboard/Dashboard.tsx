/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'
import { calculateMetrics, metricsList } from '../../utils/utils'
import MetricCard from '../metricCard/MetricCard'
import TransactionsList from '../transactions/TransactionsList'
import SpendingChart from '../spendingChart/SpendingChart'
import BudgetOverview from '../budgetOverview/BudgetOverview'
import type {
  BudgetWithCategory,
  Category,
  TransactionWithCategory
} from '../../utils/database.types'
import supabase from '../../utils/supabase'

const Dashboard = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>(
    []
  )
  const [budgets, setBudgets] = useState<BudgetWithCategory[]>([])

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [transactionsRes, categoriesRes, budgetRes] = await Promise.all([
        supabase
          .from('transactions')
          .select('*, categories(*)')
          .order('date', { ascending: true })
          .limit(15),
        supabase.from('categories').select('*'),
        supabase.from('budgets').select('*')
      ])

      if (transactionsRes.error) throw transactionsRes.error
      if (categoriesRes.error) throw categoriesRes.error
      if (budgetRes.error) throw budgetRes.error

      setTransactions(transactionsRes.data as TransactionWithCategory[])
      setCategories(categoriesRes.data)

      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()

      const budgetWithSpent = await Promise.all(
        (budgetRes.data as any[]).map(async (budget) => {
          const { data: spent } = await supabase
            .from('transactions')
            .select('amount')
            .eq('category_id', budget.category_id)
            .eq('type', 'expense')
            .gte(
              'date',
              new Date(currentYear, currentMonth, 1).toISOString().split('T')[0]
            )
            .lte(
              'date',
              new Date(currentYear, currentMonth + 1, 0)
                .toISOString()
                .split('T')[0]
            )

          const totalSpent =
            spent?.reduce((sum, s) => sum + Number(s.amount), 0) || 0

          return {
            ...budget,
            spent: totalSpent
          }
        })
      )

      setBudgets(budgetWithSpent)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const metrics = useMemo(
    () => calculateMetrics(transactions, budgets),
    [transactions, budgets]
  )

  const metricList = useMemo(() => metricsList(metrics), [metrics])

  if (loading) return <div>loading...</div>

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
            <TransactionsList transactions={transactions} />
          </div>
          <div className='space-y-6'>
            <SpendingChart data={[]} />
            <BudgetOverview budgets={budgets} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
