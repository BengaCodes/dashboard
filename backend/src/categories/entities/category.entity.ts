import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  name: string;

  @Column({ type: 'varchar', default: 'expense' })
  type: 'income' | 'expense';

  @Column()
  color: string;

  @Column()
  icon: string;

  @Column({ nullable: true })
  user_id: string;
}
