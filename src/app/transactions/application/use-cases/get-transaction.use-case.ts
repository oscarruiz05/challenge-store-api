import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionRepository } from '../../domain/repositories/transaction.repository.interface';

@Injectable()
export class GetTransactionUseCase {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository
  ) {}

  async execute(id: string): Promise<Transaction | null> {
    return this.transactionRepository.findById(id);
  }
}