import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
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

  @ManyToOne(() => Category, { nullable: true, eager: true })
  @JoinColumn({ name: 'category_id' })
  categories: Category;
}
