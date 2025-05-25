import { Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/models/transaction.model';
import { CreateTransactionCommand, CreateTransactionUseCase } from '../use-cases/create-transaction.use-case';
import { GetTransactionUseCase } from '../use-cases/get-transaction.use-case';
import { GetAllTransactionsUseCase } from '../use-cases/get-all-transactions.use-case';
import { UpdateTransactionStatusCommand, UpdateTransactionStatusUseCase } from '../use-cases/update-transaction-status.use-case';
import { ProcessTransactionPaymentCommand, ProcessTransactionPaymentUseCase, TransactionResult } from '../use-cases/process-transaction-payment.use-case';

@Injectable()
export class TransactionService {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionUseCase: GetTransactionUseCase,
    private readonly getAllTransactionsUseCase: GetAllTransactionsUseCase,
    private readonly updateTransactionStatusUseCase: UpdateTransactionStatusUseCase,
    private readonly processTransactionPaymentUseCase: ProcessTransactionPaymentUseCase,
  ) {}

  async createTransaction(command: CreateTransactionCommand): Promise<Transaction> {
    return this.createTransactionUseCase.execute(command);
  }

  async processTransactionPayment(command: ProcessTransactionPaymentCommand): Promise<TransactionResult> {
    return this.processTransactionPaymentUseCase.execute(command);
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    return this.getTransactionUseCase.execute(id);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return this.getAllTransactionsUseCase.execute();
  }

  async updateTransactionStatus(command: UpdateTransactionStatusCommand): Promise<Transaction> {
    return this.updateTransactionStatusUseCase.execute(command);
  }
}