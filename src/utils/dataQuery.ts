import { transactionsApi, type TransactionFilters } from '../api/transactions.api'
import { categoriesApi } from '../api/categories.api'
import { budgetsApi } from '../api/budgets.api'
import type { Budget, Transaction } from '../types'

export const transactionQueries = {
  all: () => ['transactions'],
  list: (filters?: TransactionFilters) => [
    ...transactionQueries.all(),
    'list',
    filters
  ],

  getTransactions: () => transactionsApi.getAll(),
  deleteTransaction: (id: number) => transactionsApi.delete(id),
  addTransaction: (transaction: Omit<Transaction, 'id'>) =>
    transactionsApi.create(transaction),
  bulkAddTransactions: (transactions: Omit<Transaction, 'id'>[]) =>
    transactionsApi.bulkCreate(transactions)
}

export const categoryQueries = {
  all: () => ['categories'],
  list: () => [...categoryQueries.all(), 'list'],
  getCategories: () => categoriesApi.getAll()
}

export const budgetQueries = {
  all: () => ['budgets'],
  list: () => [...budgetQueries.all(), 'list'],
  withSpentBudgets: (userId: string, month: string) => [
    'budgetWithSpent',
    userId,
    month
  ],

  getBudgets: () => budgetsApi.getAll(),
  getBudgetWithSpent: (selectedDate: Date) =>
    budgetsApi.getWithSpent(
      selectedDate.getFullYear(),
      selectedDate.getMonth()
    ),
  addBudget: (budget: Omit<Budget, 'id' | 'created_at'>) =>
    budgetsApi.create({
      amount: budget.amount,
      period: budget.period,
      category_id: budget.category_id ?? undefined
    })
}
