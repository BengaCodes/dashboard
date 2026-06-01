import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  date: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  category_id: number;

  @Column({ type: 'varchar' })
  type: 'income' | 'expense';

  @Column({ nullable: true })
  user_id: string;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ default: false })
  recurring: boolean;

  @Column({ type: 'varchar', nullable: true })
  recurring_frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;

  @Column({ type: 'date', nullable: true })
  recurring_end_date: string | null;

  @Column({ type: 'date', nullable: true })
  recurring_next_date: string | null;

  @Column({ type: 'varchar', nullable: true })
  parent_recurring_id: string | null;

  // Soft-delete timestamp — TypeORM excludes rows where this is set in all
  // standard find() / findOne() / QueryBuilder queries automatically.
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;

  @ManyToOne(() => Category, { nullable: true, eager: true })
  @JoinColumn({ name: 'category_id' })
  categories: Category;
}
