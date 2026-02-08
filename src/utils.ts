export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('en-UK', {
    month: 'short',
    day: 'numeric'
  }).format(date)
}

export const formatAmount = (
  amount: number,
  type: 'income' | 'expenditure'
) => {
  const formatted = new Intl.NumberFormat('en-Uk', {
    style: 'currency',
    currency: 'GBP'
  }).format(amount)

  return type === 'income' ? `+${formatted}` : `-${formatted}`
}
