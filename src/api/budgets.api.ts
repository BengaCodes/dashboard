import { api } from './client'
import type { Budget, BudgetWithCategory } from '../types'

export const budgetsApi = {
  getAll: () => api.get<BudgetWithCategory[]>('/budgets'),

  getWithSpent: (year: number, month: number) =>
    api.get<BudgetWithCategory[]>(
      `/budgets/with-spent?year=${year}&month=${month}`
    ),

  create: (budget: { amount: number; period: string; category_id?: number }) =>
    api.post<Budget>('/budgets', budget),
}
