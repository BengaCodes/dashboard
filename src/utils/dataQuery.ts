import type {
  Budget,
  BudgetWithCategory,
  Category,
  Transaction,
  TransactionWithCategory
} from './database.types'
import supabase from './supabase'

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
  withSpent: () => [],

  getBudgets: async () => {
    const res = await supabase.from('budgets').select('*, categories(*)')
    if (res.error) throw res.error
    return res.data
  },

  getBudgetWithSpent: async () => {
    const budgetRes = await supabase.from('budgets').select('*, categories(*)')
    if (budgetRes.error) throw budgetRes.error

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const budgetWithSpent = await Promise.all(
      (budgetRes.data || []).map(async (budget) => {
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

    return budgetWithSpent as BudgetWithCategory[]
  },

  addBudget: async (budget: Omit<Budget, 'id' | 'created_at'>) => {
    const res = await supabase.from('budgets').insert(budget)

    if (res.error) throw res.error

    return res
  }
}
