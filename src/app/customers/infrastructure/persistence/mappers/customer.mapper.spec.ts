import { CustomerMapper } from './customer.mapper';
import { CustomerOrmEntity } from '../entities/customer.orm.entity';
import { Customer } from '../../../domain/models/customer.model';

describe('CustomerMapper', () => {
  const mockCustomerId = '123e4567-e89b-12d3-a456-426614174000';
  
  describe('fromDomain', () => {
    it('should map a domain Customer to a CustomerOrmEntity', () => {
      // Arrange
      const domainCustomer = new Customer(
        mockCustomerId,
        'John',
        'Doe',
        'john.doe@example.com',
        '1234567890',
        '123 Main St'
      );

      // Act
      const ormEntity = CustomerMapper.fromDomain(domainCustomer);

      // Assert
      expect(ormEntity).toBeInstanceOf(CustomerOrmEntity);
      expect(ormEntity.id).toBe(mockCustomerId);
      expect(ormEntity.name).toBe('John');
      expect(ormEntity.last_name).toBe('Doe');
      expect(ormEntity.email).toBe('john.doe@example.com');
      expect(ormEntity.number_phone).toBe('1234567890');
      expect(ormEntity.address).toBe('123 Main St');
    });
  });

  describe('toDomain', () => {
    it('should map a CustomerOrmEntity to a domain Customer', () => {
      // Arrange
      const ormEntity = new CustomerOrmEntity();
      ormEntity.id = mockCustomerId;
      ormEntity.name = 'John';
      ormEntity.last_name = 'Doe';
      ormEntity.email = 'john.doe@example.com';
      ormEntity.number_phone = '1234567890';
      ormEntity.address = '123 Main St';

      // Act
      const domainCustomer = CustomerMapper.toDomain(ormEntity);

      // Assert
      expect(domainCustomer).toBeInstanceOf(Customer);
      expect(domainCustomer.id).toBe(mockCustomerId);
      expect(domainCustomer.name).toBe('John');
      expect(domainCustomer.last_name).toBe('Doe');
      expect(domainCustomer.email).toBe('john.doe@example.com');
      expect(domainCustomer.number_phone).toBe('1234567890');
      expect(domainCustomer.address).toBe('123 Main St');
    });
  });
});