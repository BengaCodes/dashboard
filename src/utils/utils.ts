import {
  Minus,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet
} from 'lucide-react'
import type { BudgetWithCategory, Category, TransactionWithCategory } from '../types'

export const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat('en-GB', { month: 'short', day: 'numeric' }).format(
    new Date(dateStr)
  )

export const formatAmount = (amount: number, type?: 'income' | 'expense') => {
  const formatted = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(amount)

  if (type === 'income') return `+${formatted}`
  if (type === 'expense') return `-${formatted}`
  return formatted
}

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0
  }).format(amount)

export const getPercentage = (spent: number, budget: number) =>
  Math.min((spent / budget) * 100, 100)

export const getStatus = (percentage: number) => {
  if (percentage >= 90)
    return { color: 'text-red-600', bg: 'bg-red-100', icon: TrendingUp }
  if (percentage >= 70)
    return { color: 'text-amber-600', bg: 'bg-amber-100', icon: Minus }
  return { color: 'text-emerald-600', bg: 'bg-emerald-100', icon: TrendingDown }
}

export const calculateMetrics = (
  transactions: TransactionWithCategory[] | undefined,
  budgets: BudgetWithCategory[] | undefined,
  date: Date
) => {
  const month = date.getMonth()
  const year = date.getFullYear()

  const monthTx = (transactions ?? []).filter((t) => {
    const d = new Date(t.date)
    return d.getMonth() === month && d.getFullYear() === year
  })

  const totalIncome = monthTx
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpenses = monthTx
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = totalIncome - totalExpenses

  const totalBudget = (budgets ?? []).reduce(
    (sum, b) => sum + Number(b.amount),
    0
  )

  return { totalIncome, totalExpenses, balance, totalBudget }
}

export const getSpendingByCategory = (
  categories: Category[] | undefined,
  transactions: TransactionWithCategory[] | undefined,
  date: Date
) => {
  const month = date.getMonth()
  const year = date.getFullYear()

  const expenseCategories = (categories ?? []).filter(
    (c) => c.type === 'expense'
  )

  const spending = expenseCategories
    .map((category) => {
      const amount = (transactions ?? [])
        .filter((t) => {
          const d = new Date(t.date)
          return (
            t.category_id === category.id &&
            t.type === 'expense' &&
            d.getMonth() === month &&
            d.getFullYear() === year
          )
        })
        .reduce((sum, t) => sum + Number(t.amount), 0)
      return { category, amount }
    })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  const total = spending.reduce((sum, item) => sum + item.amount, 0)

  return spending.map((item) => ({
    ...item,
    percentage: total > 0 ? (item.amount / total) * 100 : 0
  }))
}

type ChangeType = 'positive' | 'negative' | 'neutral'

export const metricsList = (metrics: ReturnType<typeof calculateMetrics>) => [
  {
    title: 'Total Balance',
    value: formatCurrency(metrics.balance),
    change: metrics.balance >= 0 ? 'On track' : 'Over budget',
    changeType: (metrics.balance >= 0 ? 'positive' : 'negative') as ChangeType,
    icon: Wallet,
    iconColor: 'bg-blue-600'
  },
  {
    title: 'Total Income',
    value: formatCurrency(metrics.totalIncome),
    change: 'This month',
    changeType: 'positive' as ChangeType,
    icon: TrendingUp,
    iconColor: 'bg-emerald-600'
  },
  {
    title: 'Total Expenses',
    value: formatCurrency(metrics.totalExpenses),
    change: 'This month',
    changeType: 'negative' as ChangeType,
    icon: TrendingDown,
    iconColor: 'bg-red-600'
  },
  {
    title: 'Total Budget',
    value: formatCurrency(metrics.totalBudget),
    change: 'Monthly limit',
    changeType: 'neutral' as ChangeType,
    icon: PiggyBank,
    iconColor: 'bg-amber-600'
  }
]

export const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
