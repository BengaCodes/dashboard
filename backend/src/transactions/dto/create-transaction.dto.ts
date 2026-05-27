import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsBoolean,
  IsIn,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @ApiProperty({ example: '2025-01-15' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Groceries at Tesco' })
  @IsString()
  description: string;

  @ApiProperty({ example: 45.99 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  category_id?: number;

  @ApiProperty({ enum: ['income', 'expense'], example: 'expense' })
  @IsIn(['income', 'expense'])
  type: 'income' | 'expense';

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  recurring?: boolean;

  @ApiProperty({ required: false, enum: ['daily', 'weekly', 'monthly', 'yearly'] })
  @IsOptional()
  @IsIn(['daily', 'weekly', 'monthly', 'yearly'])
  recurring_frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  recurring_end_date?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  recurring_next_date?: string;
}

export class BulkCreateTransactionDto {
  @ApiProperty({ type: [CreateTransactionDto] })
  transactions: CreateTransactionDto[];
}
