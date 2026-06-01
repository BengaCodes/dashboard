import { api } from './client'
import type { TransactionWithCategory, Transaction } from '../types'

export type TransactionFilters = {
  startDate?: string
  endDate?: string
  type?: 'income' | 'expense'
  limit?: number
  order?: 'asc' | 'desc'
}

export const transactionsApi = {
  getAll: (filters?: TransactionFilters) => {
    const params = filters
      ? '?' +
        new URLSearchParams(
          Object.fromEntries(
            Object.entries(filters)
              .filter(([, v]) => v !== undefined)
              .map(([k, v]) => [k, String(v)])
          )
        ).toString()
      : ''
    return api.get<TransactionWithCategory[]>(`/transactions${params}`)
  },

  create: (transaction: Omit<Transaction, 'id'>) =>
    api.post<TransactionWithCategory>('/transactions', transaction),

  bulkCreate: (transactions: Omit<Transaction, 'id'>[]) =>
    api.post<TransactionWithCategory[]>('/transactions/bulk', { transactions }),

  update: (id: number, data: Partial<Omit<Transaction, 'id'>>) =>
    api.put<TransactionWithCategory>(`/transactions/${id}`, data),

  delete: (id: number) => api.delete<void>(`/transactions/${id}`),
}
