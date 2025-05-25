import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionRepository } from '../../domain/repositories/transaction.repository.interface';
import { TransactionStatusEnum } from '../../infrastructure/persistence/entities/transaction.orm.entity';

export interface UpdateTransactionCommand {
  id: string;
  status: TransactionStatusEnum;
  transaction_id: string;
}

@Injectable()
export class UpdateTransactionUseCase {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(command: UpdateTransactionCommand): Promise<Transaction> {
    const existingTransaction = await this.transactionRepository.findById(
      command.id,
    );
    if (!existingTransaction) {
      throw new Error(`Transaction with id ${command.id} not found`);
    }
    
    existingTransaction.transaction_id = command.transaction_id;
    existingTransaction.status = command.status;
    
    return this.transactionRepository.update(existingTransaction);
  }
}
