import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionOrmEntity } from './infrastructure/persistence/entities/transaction.orm.entity';
import { TypeOrmTransactionRepository } from './infrastructure/persistence/repositories/typeorm-transaction.repository';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { GetTransactionUseCase } from './application/use-cases/get-transaction.use-case';
import { GetAllTransactionsUseCase } from './application/use-cases/get-all-transactions.use-case';
import { UpdateTransactionStatusUseCase } from './application/use-cases/update-transaction-status.use-case';
import { TransactionService } from './application/services/transaction.service';
import { TransactionsController } from './infrastructure/controllers/transactions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionOrmEntity])],
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
    // services
    TransactionService,
  ],
  exports: [TransactionService],
})
export class TransactionsModule {}
