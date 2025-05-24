import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionRepository } from '../../domain/repositories/transaction.repository.interface';

@Injectable()
export class GetAllTransactionsUseCase {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository
  ) {}

  async execute(): Promise<Transaction[]> {
    return this.transactionRepository.findAll();
  }
}