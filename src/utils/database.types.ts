export type Category = {
  id: number
  created_at: string
  name: string
  type: 'income' | 'expense'
  color: string
  icon: string
}

export type Budget = {
  id: number
  created_at: string
  amount: number
  period: string
  category_id: number | null
}
export type Transaction = {
  id: number;
  date: string;
  description: string;
  amount: number;
  category_id: number | null;
  type: 'income' | 'expense';
  user_id?: string;
  recurring?: boolean;
  recurring_frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurring_end_date?: string | null;
  recurring_next_date?: string | null;
  parent_recurring_id?: string | null;
}

// Extended types with relations
export type BudgetWithCategory = Budget & {
  categories: Category
  spent: number
}

export type TransactionWithCategory = Transaction & {
  categories: Category
}

// Insert types (without id and created_at)
export type CategoryInsert = Omit<Category, 'id' | 'created_at'>
export type BudgetInsert = Omit<Budget, 'id' | 'created_at'>
export type TransactionInsert = Omit<Transaction, 'id' | 'created_at'>

// Update types (all fields optional except id)
export type CategoryUpdate = Partial<CategoryInsert> & { id: number }
export type BudgetUpdate = Partial<BudgetInsert> & { id: number }
export type TransactionUpdate = Partial<TransactionInsert> & { id: number }
