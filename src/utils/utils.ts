/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Minus,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet
} from 'lucide-react'
import type { Category, TransactionWithCategory } from './database.types'

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('en-UK', {
    month: 'short',
    day: 'numeric'
  }).format(date)
}

export const formatAmount = (amount: number, type?: 'income' | 'expense') => {
  const formatted = new Intl.NumberFormat('en-Uk', {
    style: 'currency',
    currency: 'GBP'
  }).format(amount)

  if (type) return type === 'income' ? `+${formatted}` : `-${formatted}`

  return formatted
}

export const getPercentage = (spent: number, budget: number) => {
  return Math.min((spent / budget) * 100, 100)
}

export const getStatus = (percentage: number) => {
  if (percentage >= 90)
    return { color: 'text-red-600', bg: 'bg-red-100', icon: TrendingUp }
  if (percentage >= 70)
    return { color: 'text-amber-600', bg: 'bg-amber-100', icon: Minus }
  return { color: 'text-emerald-600', bg: 'bg-emerald-100', icon: TrendingDown }
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-UK', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0
  }).format(amount)
}

export const calculateMetrics = (transactions: any, budgets: any) => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const currentMonthTransactions = transactions.filter((t: any) => {
    const date = new Date(t.date)
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    )
  })

  const totalIncome = currentMonthTransactions
    .filter((t: any) => t.type === 'income')
    .reduce((sum: any, t: any) => sum + Number(t.amount), 0)

  const totalExpenses = currentMonthTransactions
    .filter((t: any) => t.type === 'expense')
    .reduce((sum: any, t: any) => sum + Number(t.amount), 0)

  const balance = totalIncome - totalExpenses

  const totalBudget = budgets.reduce(
    (sum: any, b: any) => sum + Number(b.amount),
    0
  )

  return { totalIncome, totalExpenses, balance, totalBudget }
}

export const getSpendingByCategory = (
  categories: Category[],
  transactions: TransactionWithCategory[]
) => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const expenseCategories = categories.filter((c) => c.type === 'expense')

  const spending = expenseCategories
    .map((category) => {
      const amount = transactions
        .filter((t) => {
          const date = new Date(t.date)
          return (
            t.category_id === category.id &&
            t.type === 'expense' &&
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
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
    percentage: (item.amount / total) * 100
  }))
}

export const metricsList = (metrics: any) => {
  return [
    {
      title: 'Total Balance',
      value: formatCurrency(metrics.balance),
      change: metrics.balance >= 0 ? 'On track' : 'Over budget',
      changeType: metrics.balance >= 0 ? 'positive' : 'negative',
      icon: Wallet,
      iconColor: 'bg-blue-600'
    },
    {
      title: 'Total Income',
      value: formatCurrency(metrics.totalIncome),
      change: 'This month',
      changeType: 'positive',
      icon: TrendingUp,
      iconColor: 'bg-emerald-600'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(metrics.totalExpenses),
      change: 'This month',
      changeType: 'negative',
      icon: TrendingDown,
      iconColor: 'bg-red-600'
    },
    {
      title: 'Total Budget',
      value: formatCurrency(metrics.totalBudget),
      change: 'Monthly limit',
      changeType: 'neutral',
      icon: PiggyBank,
      iconColor: 'bg-amber-600'
    }
  ]
}
