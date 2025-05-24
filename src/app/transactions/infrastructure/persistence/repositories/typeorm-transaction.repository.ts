import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../../domain/models/transaction.model';
import { TransactionRepository } from '../../../domain/repositories/transaction.repository.interface';
import { TransactionOrmEntity, TransactionStatusEnum } from '../entities/transaction.orm.entity';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class TypeOrmTransactionRepository implements TransactionRepository {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly transactionRepository: Repository<TransactionOrmEntity>,
  ) {}

  async findById(id: string): Promise<Transaction | null> {
    const transactionEntity = await this.transactionRepository.findOne({
      where: { id },
    });
    return transactionEntity ? TransactionMapper.toDomain(transactionEntity) : null;
  }

  async findAll(): Promise<Transaction[]> {
    const transactionEntities = await this.transactionRepository.find();
    return transactionEntities.map(TransactionMapper.toDomain);
  }

  async save(transaction: Transaction): Promise<Transaction> {
    const transactionEntity = TransactionMapper.toOrmEntity(transaction);
    const savedEntity = await this.transactionRepository.save(transactionEntity);
    return TransactionMapper.toDomain(savedEntity);
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const existingTransaction = await this.transactionRepository.findOne({
      where: { id: transaction.id },
    });

    if (!existingTransaction) {
      throw new Error(`Transaction with id ${transaction.id} not found`);
    }

    const transactionEntity = TransactionMapper.toOrmEntity(transaction);
    transactionEntity.created_at = existingTransaction.created_at;

    const updatedEntity = await this.transactionRepository.save(transactionEntity);
    return TransactionMapper.toDomain(updatedEntity);
  }

  async updateStatus(id: string, status: string): Promise<Transaction> {
    const existingTransaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!existingTransaction) {
      throw new Error(`Transaction with id ${id} not found`);
    }

    existingTransaction.status = status as TransactionStatusEnum;

    const updatedEntity = await this.transactionRepository.save(existingTransaction);
    return TransactionMapper.toDomain(updatedEntity);
  }
}