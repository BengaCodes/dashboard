import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FilterTransactionsDto } from './dto/filter-transactions.dto';
import type { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
  ) {}

  async findAll(userId: string, filters: FilterTransactionsDto = {}): Promise<Transaction[]> {
    const query = this.repo
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.categories', 'category')
      .where('t.user_id = :userId', { userId })
      // @DeleteDateColumn causes TypeORM to add this automatically, but we
      // include it explicitly for clarity and QueryBuilder safety.
      .andWhere('t.deleted_at IS NULL')
      .orderBy('t.date', filters.order === 'asc' ? 'ASC' : 'DESC')
      .addOrderBy('t.id', 'DESC');

    if (filters.startDate) {
      query.andWhere('t.date >= :startDate', { startDate: filters.startDate });
    }
    if (filters.endDate) {
      query.andWhere('t.date <= :endDate', { endDate: filters.endDate });
    }
    if (filters.type) {
      query.andWhere('t.type = :type', { type: filters.type });
    }
    if (filters.limit) {
      query.limit(filters.limit);
    }

    return query.getMany();
  }

  async create(userId: string, dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.repo.create({ ...dto, user_id: userId });
    const saved = await this.repo.save(transaction);
    return this.repo.findOne({
      where: { id: saved.id },
      relations: ['categories'],
    });
  }

  async bulkCreate(userId: string, dtos: CreateTransactionDto[]): Promise<Transaction[]> {
    const transactions = dtos.map((dto) =>
      this.repo.create({ ...dto, user_id: userId }),
    );
    const saved = await this.repo.save(transactions);
    const ids = saved.map((t) => t.id);
    return this.repo
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.categories', 'category')
      .where('t.id IN (:...ids)', { ids })
      .andWhere('t.deleted_at IS NULL')
      .getMany();
  }

  async update(id: number, userId: string, dto: UpdateTransactionDto): Promise<Transaction> {
    const existing = await this.repo.findOne({
      where: { id, user_id: userId },
    });
    if (!existing) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }

    await this.repo.update({ id, user_id: userId }, dto);

    return this.repo.findOne({
      where: { id },
      relations: ['categories'],
    });
  }

  // Soft delete — sets deleted_at rather than removing the row.
  async delete(id: number, userId: string): Promise<void> {
    const result = await this.repo.softDelete({ id, user_id: userId });
    if (!result.affected) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }
  }
}
