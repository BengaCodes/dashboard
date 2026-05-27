import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', type: 'expense', color: '#FF6B6B', icon: 'Utensils' },
  { name: 'Transportation', type: 'expense', color: '#4ECDC4', icon: 'Car' },
  { name: 'Entertainment', type: 'expense', color: '#95E1D3', icon: 'Film' },
  { name: 'Salary', type: 'income', color: '#38A169', icon: 'DollarSign' },
  { name: 'Shopping', type: 'expense', color: '#9B59B6', icon: 'ShoppingBag' },
  { name: 'Groceries', type: 'expense', color: '#F39C12', icon: 'ShoppingCart' },
  { name: 'Healthcare', type: 'expense', color: '#E74C3C', icon: 'Heart' },
  { name: 'Utilities', type: 'expense', color: '#3498DB', icon: 'Zap' },
  { name: 'Housing', type: 'expense', color: '#34495E', icon: 'Home' },
  { name: 'Education', type: 'expense', color: '#16A085', icon: 'BookOpen' },
  { name: 'Insurance', type: 'expense', color: '#8E44AD', icon: 'Shield' },
  { name: 'Travel', type: 'expense', color: '#E67E22', icon: 'Plane' },
  { name: 'Fitness', type: 'expense', color: '#27AE60', icon: 'Activity' },
  { name: 'Personal Care', type: 'expense', color: '#F39C12', icon: 'Smile' },
  { name: 'Subscriptions', type: 'expense', color: '#1ABC9C', icon: 'Repeat' },
  { name: 'Gifts & Donations', type: 'expense', color: '#E91E63', icon: 'Gift' },
  { name: 'Freelance Income', type: 'income', color: '#2ECC71', icon: 'Briefcase' },
  { name: 'Investment Returns', type: 'income', color: '#27AE60', icon: 'TrendingUp' },
] as const;

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  findAll(userId: string): Promise<Category[]> {
    return this.repo.find({
      where: { user_id: userId },
      order: { name: 'ASC' },
    });
  }

  async seedDefaultCategories(userId: string): Promise<void> {
    const categories = DEFAULT_CATEGORIES.map((c) =>
      this.repo.create({ ...c, user_id: userId }),
    );
    await this.repo.save(categories);
  }
}
