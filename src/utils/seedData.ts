import type {
  BudgetInsert,
  CategoryInsert,
  TransactionInsert
} from './database.types'
import supabase from './supabase'

export async function seedData() {
  try {
    const categoryData: CategoryInsert[] = [
      {
        name: 'Food & Dining',
        type: 'expense',
        color: '#FF6B6B',
        icon: 'Utensils'
      },
      {
        name: 'Transportation',
        type: 'expense',
        color: '#4ECDC4',
        icon: 'Car'
      },
      {
        name: 'Entertainment',
        type: 'expense',
        color: '#95E1D3',
        icon: 'Film'
      },
      { name: 'Salary', type: 'income', color: '#38A169', icon: 'DollarSign' },
      {
        name: 'Shopping',
        type: 'expense',
        color: '#9B59B6',
        icon: 'ShoppingBag'
      },
      {
        name: 'Groceries',
        type: 'expense',
        color: '#F39C12',
        icon: 'ShoppingCart'
      },
      {
        name: 'Healthcare',
        type: 'expense',
        color: '#E74C3C',
        icon: 'Heart'
      },
      {
        name: 'Utilities',
        type: 'expense',
        color: '#3498DB',
        icon: 'Zap'
      },
      {
        name: 'Housing',
        type: 'expense',
        color: '#34495E',
        icon: 'Home'
      },
      {
        name: 'Education',
        type: 'expense',
        color: '#16A085',
        icon: 'BookOpen'
      },
      {
        name: 'Insurance',
        type: 'expense',
        color: '#8E44AD',
        icon: 'Shield'
      },
      {
        name: 'Travel',
        type: 'expense',
        color: '#E67E22',
        icon: 'Plane'
      },
      {
        name: 'Fitness',
        type: 'expense',
        color: '#27AE60',
        icon: 'Activity'
      },
      {
        name: 'Personal Care',
        type: 'expense',
        color: '#F39C12',
        icon: 'Smile'
      },
      {
        name: 'Subscriptions',
        type: 'expense',
        color: '#1ABC9C',
        icon: 'Repeat'
      },
      {
        name: 'Gifts & Donations',
        type: 'expense',
        color: '#E91E63',
        icon: 'Gift'
      },
      {
        name: 'Freelance Income',
        type: 'income',
        color: '#2ECC71',
        icon: 'Briefcase'
      },
      {
        name: 'Investment Returns',
        type: 'income',
        color: '#27AE60',
        icon: 'TrendingUp'
      }
    ]

    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()

    if (categoriesError) throw categoriesError
    console.log('Categories inserted:', categories)

    // Insert sample budgets
    const budgetData: BudgetInsert[] = [
      { amount: 50000, period: 'monthly', category_id: categories![0].id },
      { amount: 30000, period: 'monthly', category_id: categories![1].id },
      { amount: 20000, period: 'monthly', category_id: categories![2].id }
    ]

    const { data: budgets, error: budgetsError } = await supabase
      .from('budgets')
      .insert(budgetData)
      .select()

    if (budgetsError) throw budgetsError
    console.log('Budgets inserted:', budgets)

    // Insert sample transactions
    const transactionData: TransactionInsert[] = [
      {
        amount: 1500,
        description: 'Lunch at restaurant',
        date: '2026-02-08',
        type: 'expense',
        category_id: categories![0].id
      },
      {
        amount: 5000,
        description: 'Gas refill',
        date: '2026-02-07',
        type: 'expense',
        category_id: categories![1].id
      },
      {
        amount: 3000,
        description: 'Movie tickets',
        date: '2026-02-06',
        type: 'expense',
        category_id: categories![2].id
      },
      {
        amount: 150000,
        description: 'Monthly salary',
        date: '2026-02-01',
        type: 'income',
        category_id: categories![3].id
      }
    ]

    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .insert(transactionData)
      .select()

    if (transactionsError) throw transactionsError
    console.log('Transactions inserted:', transactions)

    console.log('✅ Sample data seeded successfully!')
  } catch (error) {
    console.error('Error seeding data:', error)
  }
}
