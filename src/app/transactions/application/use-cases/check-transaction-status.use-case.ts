import { TransactionRepository } from '../../domain/repositories/transaction.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { PaymentGateway } from '../../../payments/domain/ports/payment.gateway';

@Injectable()
export class CheckTransactionStatusUseCase {
  constructor(
    @Inject('PaymentGateway')
    private readonly paymentGateway: PaymentGateway,
    @Inject('TransactionRepository')
    private readonly transactionRepo: TransactionRepository,
  ) {}

  async execute(id: string): Promise<boolean> {
    const transaction = await this.transactionRepo.findById(id);
    if (!transaction || !transaction.transaction_id) return true;

    const result = await this.paymentGateway.getTransactionStatus(
      transaction.transaction_id,
    );

    if (result.status !== transaction.status) {
      await this.transactionRepo.updateStatus(id, result.status);
      return true;
    }

    return false;
  }
}
