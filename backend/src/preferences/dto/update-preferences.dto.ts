import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsIn,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePreferencesDto {
  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  display_name?: string;

  @ApiPropertyOptional({ enum: ['GBP', 'USD', 'EUR'], example: 'GBP' })
  @IsOptional()
  @IsString()
  @IsIn(['GBP', 'USD', 'EUR'])
  currency?: string;

  @ApiPropertyOptional({ example: 1, minimum: 1, maximum: 28 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(28)
  @Type(() => Number)
  month_start_day?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  notify_budget_alerts?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  notify_monthly_summary?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  dark_mode?: boolean;
}
