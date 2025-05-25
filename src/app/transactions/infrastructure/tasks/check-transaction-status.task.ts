import { Inject, Injectable } from '@nestjs/common';
import { CheckTransactionStatusUseCase } from '../../application/use-cases/check-transaction-status.use-case';
import { TransactionRepository } from '../../domain/repositories/transaction.repository.interface';
import { Interval } from '@nestjs/schedule';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class CheckTransactionStatusTask {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly checkStatusUseCase: CheckTransactionStatusUseCase,
  ) {}

  start(transactionId: string) {
    const intervalName = `check-status-${transactionId}`;

    if (this.schedulerRegistry.doesExist('interval', intervalName)) {
      return;
    }

    const interval = setInterval(async () => {
      const updated = await this.checkStatusUseCase.execute(transactionId);

      if (updated) {
        this.schedulerRegistry.deleteInterval(intervalName);
      }
    }, 30000);

    this.schedulerRegistry.addInterval(intervalName, interval);
  }
}
