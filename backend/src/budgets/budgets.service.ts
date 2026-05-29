import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetsRepo: Repository<Budget>,
    @InjectRepository(Transaction)
    private readonly transactionsRepo: Repository<Transaction>,
  ) {}

  findAll(userId: string): Promise<Budget[]> {
    return this.budgetsRepo.find({
      where: { user_id: userId },
      relations: ['categories'],
    });
  }

  async findAllWithSpent(
    userId: string,
    year: number,
    month: number,
  ): Promise<(Budget & { spent: number })[]> {
    const budgets = await this.budgetsRepo.find({
      where: { user_id: userId },
      relations: ['categories'],
    });

    const monthStart = new Date(year, month, 1).toISOString().split('T')[0];
    const monthEnd = new Date(year, month + 1, 0).toISOString().split('T')[0];

    return Promise.all(
      budgets.map(async (budget) => {
        const result = await this.transactionsRepo
          .createQueryBuilder('t')
          .select('COALESCE(SUM(t.amount), 0)', 'total')
          .where('t.user_id = :userId', { userId })
          .andWhere('t.category_id = :categoryId', {
            categoryId: budget.category_id,
          })
          .andWhere('t.type = :type', { type: 'expense' })
          .andWhere('t.date >= :start', { start: monthStart })
          .andWhere('t.date <= :end', { end: monthEnd })
          .getRawOne();

        return { ...budget, spent: Number(result?.total ?? 0) };
      }),
    );
  }

  async create(userId: string, dto: CreateBudgetDto): Promise<Budget> {
    const budget = this.budgetsRepo.create({ ...dto, user_id: userId });
    const saved = await this.budgetsRepo.save(budget);
    return this.budgetsRepo.findOne({
      where: { id: saved.id },
      relations: ['categories'],
    });
  }
}
