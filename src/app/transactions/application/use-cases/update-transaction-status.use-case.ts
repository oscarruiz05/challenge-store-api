import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionRepository } from '../../domain/repositories/transaction.repository.interface';

export interface UpdateTransactionStatusCommand {
  id: string;
  status: string;
}

@Injectable()
export class UpdateTransactionStatusUseCase {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository
  ) {}

  async execute(command: UpdateTransactionStatusCommand): Promise<Transaction> {
    return this.transactionRepository.updateStatus(command.id, command.status);
  }
}