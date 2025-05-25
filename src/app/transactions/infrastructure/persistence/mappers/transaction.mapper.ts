import { Transaction } from '../../../../transactions/domain/models/transaction.model';
import { TransactionOrmEntity } from '../entities/transaction.orm.entity';

export class TransactionMapper {
  static toDomain(ormEntity: TransactionOrmEntity): Transaction {
    return new Transaction(
      ormEntity.id,
      ormEntity.product_id,
      ormEntity.customer_id,
      ormEntity.quantity,
      ormEntity.amount,
      ormEntity.transaction_id,
      ormEntity.reference,
      ormEntity.status,
    );
  }

  static toOrmEntity(domain: Transaction): TransactionOrmEntity {
    const ormEntity = new TransactionOrmEntity();
    ormEntity.id = domain.id;
    ormEntity.product_id = domain.product_id;
    ormEntity.customer_id = domain.customer_id;
    ormEntity.quantity = domain.quantity;
    ormEntity.amount = domain.amount;
    ormEntity.transaction_id = domain.transaction_id ?? '';
    ormEntity.reference = domain.reference;
    ormEntity.status = domain.status;
    return ormEntity;
  }
}