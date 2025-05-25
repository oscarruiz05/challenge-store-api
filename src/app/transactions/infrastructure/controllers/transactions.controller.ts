import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { TransactionService } from '../../application/services/transaction.service';
import { CreateTransactionCommand } from '../../application/use-cases/create-transaction.use-case';
import { Transaction } from '../../domain/models/transaction.model';
import { UpdateTransactionStatusCommand } from '../../application/use-cases/update-transaction-status.use-case';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionStatusDto } from './dtos/update-transaction-status.dto';
import { CreateTransactionWithCustomerDto } from './dtos/create-transaction-with-customer.dto';
import { ProcessTransactionPaymentCommand, TransactionResult } from '../../application/use-cases/process-transaction-payment.use-case';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResult> {
    const command: ProcessTransactionPaymentCommand = createTransactionDto;
    return this.transactionService.processTransactionPayment(command);
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