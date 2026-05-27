import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('budgets')
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column()
  period: string;

  @Column({ nullable: true })
  category_id: number | null;

  @Column({ nullable: true })
  user_id: string;

  @ManyToOne(() => Category, { nullable: true, eager: true })
  @JoinColumn({ name: 'category_id' })
  categories: Category;
}
