import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_preferences')
export class UserPreference {
  // One row per user — user_id is both PK and implicit FK.
  @PrimaryColumn({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'varchar', nullable: true })
  display_name: string | null;

  @Column({ type: 'varchar', default: 'GBP' })
  currency: string;

  @Column({ type: 'int', default: 1 })
  month_start_day: number;

  @Column({ default: true })
  notify_budget_alerts: boolean;

  @Column({ default: true })
  notify_monthly_summary: boolean;

  @Column({ default: true })
  dark_mode: boolean;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
