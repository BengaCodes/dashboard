// Re-exported from src/types for backward compatibility.
// New code should import directly from '../types'.
export type {
  Category,
  Budget,
  Transaction,
  BudgetWithCategory,
  TransactionWithCategory,
  CategoryInsert,
  BudgetInsert,
  TransactionInsert,
  Frequency,
  TransactionType
} from '../types'

import type { CategoryInsert, BudgetInsert, TransactionInsert } from '../types'

export type CategoryUpdate = Partial<CategoryInsert> & { id: number }
export type BudgetUpdate = Partial<BudgetInsert> & { id: number }
export type TransactionUpdate = Partial<TransactionInsert> & { id: number }
