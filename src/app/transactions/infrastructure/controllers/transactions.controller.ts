import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TransactionService } from '../../application/services/transaction.service';
import { CreateTransactionCommand } from '../../application/use-cases/create-transaction.use-case';
import { Transaction } from '../../domain/models/transaction.model';
import { UpdateTransactionStatusCommand } from '../../application/use-cases/update-transaction-status.use-case';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionStatusDto } from './dtos/update-transaction-status.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const command: CreateTransactionCommand = createTransactionDto;
    return this.transactionService.createTransaction(command);
  }

  @Get(':id')
  async getTransactionById(@Param('id') id: string): Promise<Transaction | null> {
    return this.transactionService.getTransactionById(id);
  }

  @Get()
  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionService.getAllTransactions();
  }

  @Put(':id/status')
  async updateTransactionStatus(
    @Param('id') id: string,
    @Body() updateTransactionStatusDto: UpdateTransactionStatusDto,
  ): Promise<Transaction> {
    const command: UpdateTransactionStatusCommand = { 
      id, 
      status: updateTransactionStatusDto.status 
    };
    return this.transactionService.updateTransactionStatus(command);
  }
}