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

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionOrmEntity]),
    CustomersModule,
    ProductsModule,
    PaymentsModule,
    DeliveriesModule,
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionService,
    CreateTransactionUseCase,
    GetTransactionUseCase,
    GetAllTransactionsUseCase,
    UpdateTransactionStatusUseCase,
    ProcessTransactionPaymentUseCase,
    {
      provide: 'TransactionRepository',
      useClass: TypeOrmTransactionRepository,
    },
  ],
  exports: [TransactionService],
})
export class TransactionsModule {}