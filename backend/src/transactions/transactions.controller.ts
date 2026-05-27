import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, BulkCreateTransactionDto } from './dto/create-transaction.dto';
import { FilterTransactionsDto } from './dto/filter-transactions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transactions for the authenticated user' })
  findAll(@Request() req, @Query() filters: FilterTransactionsDto) {
    return this.transactionsService.findAll(req.user.id, filters);
  }

  @Post()
  @ApiOperation({ summary: 'Create a single transaction' })
  create(@Request() req, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(req.user.id, dto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create transactions from CSV/Excel upload' })
  bulkCreate(@Request() req, @Body() dto: BulkCreateTransactionDto) {
    return this.transactionsService.bulkCreate(req.user.id, dto.transactions);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a transaction' })
  delete(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.delete(id, req.user.id);
  }
}
