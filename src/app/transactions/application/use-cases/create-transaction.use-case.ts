import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionRepository } from '../../domain/repositories/transaction.repository.interface';
import { TransactionStatusEnum } from '../../infrastructure/persistence/entities/transaction.orm.entity';

export interface CreateTransactionCommand {
  product_id: string;
  customer_id: string;
  quantity: number;
  amount: number;
  transaction_id: string | null;
  reference: string;
}

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository
  ) {}

  async execute(command: CreateTransactionCommand): Promise<Transaction> {
    const transaction = new Transaction(
      uuidv4(),
      command.product_id,
      command.customer_id,
      command.quantity,
      command.amount,
      command.transaction_id,
      command.reference,
      TransactionStatusEnum.PENDING,
    );

    return this.transactionRepository.save(transaction);
  }
}