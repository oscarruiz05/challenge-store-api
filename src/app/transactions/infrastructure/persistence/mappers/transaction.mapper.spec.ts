import { TransactionMapper } from './transaction.mapper';
import { TransactionOrmEntity, TransactionStatusEnum } from '../entities/transaction.orm.entity';
import { Transaction } from '../../../domain/models/transaction.model';

describe('TransactionMapper', () => {
  const mockTransactionId = '123e4567-e89b-12d3-a456-426614174000';
  
  describe('toOrmEntity', () => {
    it('should map a domain Transaction to a TransactionOrmEntity', () => {
      // Arrange
      const domainTransaction = new Transaction(
        mockTransactionId,
        'product-123',
        'customer-456',
        2,
        200,
        'payment-789',
        'REF-12345678',
        TransactionStatusEnum.PENDING
      );

      // Act
      const ormEntity = TransactionMapper.toOrmEntity(domainTransaction);

      // Assert
      expect(ormEntity).toBeInstanceOf(TransactionOrmEntity);
      expect(ormEntity.id).toBe(mockTransactionId);
      expect(ormEntity.product_id).toBe('product-123');
      expect(ormEntity.customer_id).toBe('customer-456');
      expect(ormEntity.quantity).toBe(2);
      expect(ormEntity.amount).toBe(200);
      expect(ormEntity.transaction_id).toBe('payment-789');
      expect(ormEntity.reference).toBe('REF-12345678');
      expect(ormEntity.status).toBe(TransactionStatusEnum.PENDING);
    });

    it('should handle null transaction_id', () => {
      // Arrange
      const domainTransaction = new Transaction(
        mockTransactionId,
        'product-123',
        'customer-456',
        2,
        200,
        null,
        'REF-12345678',
        TransactionStatusEnum.PENDING
      );

      // Act
      const ormEntity = TransactionMapper.toOrmEntity(domainTransaction);

      // Assert
      expect(ormEntity.transaction_id).toBe('');
    });
  });

  describe('toDomain', () => {
    it('should map a TransactionOrmEntity to a domain Transaction', () => {
      // Arrange
      const ormEntity = new TransactionOrmEntity();
      ormEntity.id = mockTransactionId;
      ormEntity.product_id = 'product-123';
      ormEntity.customer_id = 'customer-456';
      ormEntity.quantity = 2;
      ormEntity.amount = 200;
      ormEntity.transaction_id = 'payment-789';
      ormEntity.reference = 'REF-12345678';
      ormEntity.status = TransactionStatusEnum.PENDING;
      ormEntity.created_at = new Date();
      ormEntity.updated_at = new Date();

      // Act
      const domainTransaction = TransactionMapper.toDomain(ormEntity);

      // Assert
      expect(domainTransaction).toBeInstanceOf(Transaction);
      expect(domainTransaction.id).toBe(mockTransactionId);
      expect(domainTransaction.product_id).toBe('product-123');
      expect(domainTransaction.customer_id).toBe('customer-456');
      expect(domainTransaction.quantity).toBe(2);
      expect(domainTransaction.amount).toBe(200);
      expect(domainTransaction.transaction_id).toBe('payment-789');
      expect(domainTransaction.reference).toBe('REF-12345678');
      expect(domainTransaction.status).toBe(TransactionStatusEnum.PENDING);
    });
  });
});