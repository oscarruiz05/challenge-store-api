import { ProductMapper } from './product.mapper';
import { ProductOrmEntity } from '../entities/product.orm.entity';
import { Product } from '../../../domain/models/product.model';

describe('ProductMapper', () => {
  const mockProductId = '123e4567-e89b-12d3-a456-426614174000';
  
  describe('fromDomain', () => {
    it('should map a domain Product to a ProductOrmEntity', () => {
      // Arrange
      const domainProduct = new Product(
        mockProductId,
        'Test Product',
        'Test Description',
        'test-image.jpg',
        100,
        10
      );

      // Act
      const ormEntity = ProductMapper.fromDomain(domainProduct);

      // Assert
      expect(ormEntity).toBeInstanceOf(ProductOrmEntity);
      expect(ormEntity.id).toBe(mockProductId);
      expect(ormEntity.name).toBe('Test Product');
      expect(ormEntity.description).toBe('Test Description');
      expect(ormEntity.image).toBe('test-image.jpg');
      expect(ormEntity.price).toBe(100);
      expect(ormEntity.stock).toBe(10);
    });
  });

  describe('toDomain', () => {
    it('should map a ProductOrmEntity to a domain Product', () => {
      // Arrange
      const ormEntity = new ProductOrmEntity();
      ormEntity.id = mockProductId;
      ormEntity.name = 'Test Product';
      ormEntity.description = 'Test Description';
      ormEntity.image = 'test-image.jpg';
      ormEntity.price = 100;
      ormEntity.stock = 10;

      // Act
      const domainProduct = ProductMapper.toDomain(ormEntity);

      // Assert
      expect(domainProduct).toBeInstanceOf(Product);
      expect(domainProduct.id).toBe(mockProductId);
      expect(domainProduct.name).toBe('Test Product');
      expect(domainProduct.description).toBe('Test Description');
      expect(domainProduct.image).toBe('test-image.jpg');
      expect(domainProduct.price).toBe(100);
      expect(domainProduct.stock).toBe(10);
    });
  });
});