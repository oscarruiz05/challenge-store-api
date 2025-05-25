import { Transaction } from '../models/transaction.model';

export interface TransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findAll(): Promise<Transaction[]>;
  save(transaction: Transaction): Promise<Transaction>;
  update(transaction: Transaction): Promise<Transaction>;
  updateStatus(id: string, status: string): Promise<Transaction>;
  findPending(): Promise<Transaction[]>;
}