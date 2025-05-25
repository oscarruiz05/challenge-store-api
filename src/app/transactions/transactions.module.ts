import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionOrmEntity } from './infrastructure/persistence/entities/transaction.orm.entity';
import { TransactionsController } from './infrastructure/controllers/transactions.controller';
import { TransactionService } from './application/services/transaction.service';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { GetTransactionUseCase } from './application/use-cases/get-transaction.use-case';
import { GetAllTransactionsUseCase } from './application/use-cases/get-all-transactions.use-case';
import { UpdateTransactionStatusUseCase } from './application/use-cases/update-transaction-status.use-case';
import { TypeOrmTransactionRepository } from './infrastructure/persistence/repositories/typeorm-transaction.repository';
import { ProcessTransactionPaymentUseCase } from './application/use-cases/process-transaction-payment.use-case';
import { CustomersModule } from '../customers/customers.module';
import { ProductsModule } from '../products/products.module';
import { PaymentsModule } from '../payments/payments.module';
import { DeliveriesModule } from '../deliveries/deliveries.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CheckTransactionStatusUseCase } from './application/use-cases/check-transaction-status.use-case';
import { CheckTransactionStatusTask } from './infrastructure/tasks/check-transaction-status.task';
import { UpdateTransactionUseCase } from './application/use-cases/update-transaction.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionOrmEntity]),
    ScheduleModule.forRoot(),
    CustomersModule,
    ProductsModule,
    PaymentsModule,
    DeliveriesModule,
  ],
  controllers: [TransactionsController],
  providers: [
    {
      provide: 'TransactionRepository',
      useClass: TypeOrmTransactionRepository,
    },
    // use cases
    CreateTransactionUseCase,
    GetTransactionUseCase,
    GetAllTransactionsUseCase,
    UpdateTransactionStatusUseCase,
    UpdateTransactionUseCase,
    ProcessTransactionPaymentUseCase,
    CheckTransactionStatusUseCase,
    CheckTransactionStatusTask,
    // services
    TransactionService,
  ],
  exports: [TransactionService],
})
export class TransactionsModule {}