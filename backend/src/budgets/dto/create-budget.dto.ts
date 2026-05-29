import { IsNumber, IsString, IsOptional, IsIn, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBudgetDto {
  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @ApiProperty({ enum: ['Daily', 'Fortnightly', 'Monthly', 'Yearly'], example: 'Monthly' })
  @IsString()
  @IsIn(['Daily', 'Fortnightly', 'Monthly', 'Yearly'])
  period: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  category_id?: number;
}
