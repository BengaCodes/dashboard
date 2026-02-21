import type {
  Budget,
  BudgetWithCategory,
  Category,
  Transaction,
  TransactionWithCategory
} from './database.types'
import supabase from './supabase'
import type { AuthUser } from './auth.type'

export const transactionQueries = {
  all: () => ['transactions'],
  list: (filters?: { limit?: number; order?: 'asc' | 'desc' }) => [
    ...transactionQueries.all(),
    'list',
    filters
  ],
  detail: (id: number) => [...transactionQueries.all(), 'detail', id],

  getTransactions: async (limit = 15) => {
    const res = await supabase
      .from('transactions')
      .select('*, categories(*)')
      .order('date', { ascending: false })
      .limit(limit)

    if (res.error) throw res.error

    return res.data as TransactionWithCategory[]
  },

  deleteTransaction: async (id: number) => {
    const res = await supabase.from('transactions').delete().eq('id', id)
    if (res.error) throw res.error
    return res
  },

  addTransaction: async (
    transaction:
      | Omit<Transaction, 'id' | 'created_at'>
      | Omit<Transaction, 'id' | 'created_at'>[]
  ) => {
    const res = await supabase.from('transactions').insert(transaction)
    if (res.error) throw res.error

    return res
  }
}

export const categoryQueries = {
  all: () => ['categories'],
  list: () => [...categoryQueries.all(), 'list'],

  getCategories: async () => {
    const res = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })
    if (res.error) throw res.error
    return res.data as Category[]
  }
}

export const budgetQueries = {
  all: () => ['budgets'],
  list: () => [...budgetQueries.all(), 'list'],
  withSpentBudgets: (user: AuthUser, selectedMonth: string) => [
    'budgetWithSpent',
    user?.id,
    selectedMonth
  ],
  withSpent: () => [],

  getBudgets: async () => {
    const res = await supabase.from('budgets').select('*, categories(*)')
    if (res.error) throw res.error
    return res.data
  },

  getBudgetWithSpent: async (selectedDate: Date) => {
    const budgetRes = await supabase.from('budgets').select('*, categories(*)')
    if (budgetRes.error) throw budgetRes.error

    const monthStart = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    )
    const monthEnd = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0
    )

    const budgetWithSpent = await Promise.all(
      (budgetRes.data || []).map(async (budget) => {
        const { data: spent } = await supabase
          .from('transactions')
          .select('amount')
          .eq('category_id', budget.category_id)
          .eq('type', 'expense')
          .gte('date', monthStart.toISOString().split('T')[0])
          .lte('date', monthEnd.toISOString().split('T')[0])

        const totalSpent = (spent || []).reduce((sum, t) => sum + t.amount, 0)

        return {
          ...budget,
          spent: totalSpent
        }
      })
    )

    return budgetWithSpent as BudgetWithCategory[]
  },

  addBudget: async (budget: Omit<Budget, 'id' | 'created_at'>) => {
    const res = await supabase.from('budgets').insert(budget)

    if (res.error) throw res.error

    return res
  }
}
