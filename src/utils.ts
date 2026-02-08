/* eslint-disable @typescript-eslint/no-explicit-any */
import { PiggyBank, TrendingDown, TrendingUp, Wallet } from 'lucide-react'

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('en-UK', {
    month: 'short',
    day: 'numeric'
  }).format(date)
}

export const formatAmount = (
  amount: number,
  type?: 'income' | 'expenditure'
) => {
  const formatted = new Intl.NumberFormat('en-Uk', {
    style: 'currency',
    currency: 'GBP'
  }).format(amount)

  if (type) return type === 'income' ? `+${formatted}` : `-${formatted}`

  return formatted
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-UK', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount)
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
      value: formatCurrency(metrics.totalExpense),
      change: 'This month',
      changeType: 'negative',
      icon: TrendingDown,
      iconColor: 'bg-red-600'
    },
    {
      title: 'Total Budget',
      value: formatCurrency(metrics.Budget),
      change: 'Monthly limit',
      changeType: 'neutral',
      icon: PiggyBank,
      iconColor: 'bg-amber-600'
    }
  ]
}
