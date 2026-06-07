export const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat('en-GB', { month: 'short', day: 'numeric' }).format(
    new Date(dateStr)
  )

export const formatAmount = (amount: number, type?: 'income' | 'expense') => {
  const formatted = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount)

  if (type === 'income') return `+${formatted}`
  if (type === 'expense') return `-${formatted}`
  return formatted
}

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
