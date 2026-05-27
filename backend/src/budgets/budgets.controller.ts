import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

class BudgetQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  year?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  month?: number;
}

@ApiTags('budgets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all budgets' })
  findAll(@Request() req) {
    return this.budgetsService.findAll(req.user.id);
  }

  @Get('with-spent')
  @ApiOperation({ summary: 'Get budgets with spending totals for a given month' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number, description: '0-indexed (0=Jan)' })
  findAllWithSpent(@Request() req, @Query() query: BudgetQueryDto) {
    const now = new Date();
    const year = query.year ?? now.getFullYear();
    const month = query.month ?? now.getMonth();
    return this.budgetsService.findAllWithSpent(req.user.id, year, month);
  }

  @Post()
  @ApiOperation({ summary: 'Create a budget' })
  create(@Request() req, @Body() dto: CreateBudgetDto) {
    return this.budgetsService.create(req.user.id, dto);
  }
}
