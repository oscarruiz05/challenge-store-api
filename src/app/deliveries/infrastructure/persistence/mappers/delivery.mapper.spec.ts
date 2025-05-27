import { DeliveryMapper } from './delivery.mapper';
import { DeliveryOrmEntity, DeliveryStatusEnum } from '../entities/delivery.orm';
import { Delivery } from '../../../domain/models/delivery.model';

describe('DeliveryMapper', () => {
  const mockDeliveryId = '123e4567-e89b-12d3-a456-426614174000';
  
  describe('toOrmEntity', () => {
    it('should map a domain Delivery to a DeliveryOrmEntity', () => {
      // Arrange
      const domainDelivery = new Delivery(
        mockDeliveryId,
        'transaction-123',
        'product-456',
        'customer-789',
        '123 Main St',
        DeliveryStatusEnum.PENDING
      );

      // Act
      const ormEntity = DeliveryMapper.toOrmEntity(domainDelivery);

      // Assert
      expect(ormEntity).toBeInstanceOf(DeliveryOrmEntity);
      expect(ormEntity.id).toBe(mockDeliveryId);
      expect(ormEntity.transaction_id).toBe('transaction-123');
      expect(ormEntity.product_id).toBe('product-456');
      expect(ormEntity.customer_id).toBe('customer-789');
      expect(ormEntity.address).toBe('123 Main St');
      expect(ormEntity.status).toBe(DeliveryStatusEnum.PENDING);
      expect(ormEntity.updated_at).toBeInstanceOf(Date);
    });
  });

  describe('toDomain', () => {
    it('should map a DeliveryOrmEntity to a domain Delivery', () => {
      // Arrange
      const ormEntity = new DeliveryOrmEntity();
      ormEntity.id = mockDeliveryId;
      ormEntity.transaction_id = 'transaction-123';
      ormEntity.product_id = 'product-456';
      ormEntity.customer_id = 'customer-789';
      ormEntity.address = '123 Main St';
      ormEntity.status = DeliveryStatusEnum.PENDING;
      ormEntity.created_at = new Date();
      ormEntity.updated_at = new Date();

      // Act
      const domainDelivery = DeliveryMapper.toDomain(ormEntity);

      // Assert
      expect(domainDelivery).toBeInstanceOf(Delivery);
      expect(domainDelivery.id).toBe(mockDeliveryId);
      expect(domainDelivery.transaction_id).toBe('transaction-123');
      expect(domainDelivery.product_id).toBe('product-456');
      expect(domainDelivery.customer_id).toBe('customer-789');
      expect(domainDelivery.address).toBe('123 Main St');
      expect(domainDelivery.status).toBe(DeliveryStatusEnum.PENDING);
    });
  });
});