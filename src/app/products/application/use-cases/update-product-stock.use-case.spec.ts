import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProductStockUseCase } from './update-product-stock.use-case';
import { ProductRepository } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/models/product.model';
import { NotFoundException } from '@nestjs/common';

describe('UpdateProductStockUseCase', () => {
  let useCase: UpdateProductStockUseCase;
  let productRepository: ProductRepository;

  const mockProductId = '123e4567-e89b-12d3-a456-426614174000';
  const mockProduct = new Product(
    mockProductId,
    'Test Product',
    'Test Description',
    'test-image.jpg',
    100,
    10
  );

  const updatedMockProduct = new Product(
    mockProductId,
    'Test Product',
    'Test Description',
    'test-image.jpg',
    100,
    8
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProductStockUseCase,
        {
          provide: 'ProductRepository',
          useValue: {
            findById: jest.fn().mockResolvedValue(mockProduct),
            update: jest.fn().mockResolvedValue(updatedMockProduct),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateProductStockUseCase>(UpdateProductStockUseCase);
    productRepository = module.get<ProductRepository>('ProductRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update product stock successfully', async () => {
      const command = {
        id: mockProductId,
        stock: 8,
      };

      const result = await useCase.execute(command);

      expect(productRepository.findById).toHaveBeenCalledWith(mockProductId);
      expect(productRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockProductId,
          stock: 8,
        }),
      );
      expect(result).toEqual(updatedMockProduct);
    });

    it('should throw NotFoundException when product is not found', async () => {
      jest.spyOn(productRepository, 'findById').mockResolvedValueOnce(null);

      const command = {
        id: 'non-existent-id',
        stock: 8,
      };

      await expect(useCase.execute(command)).rejects.toThrow(NotFoundException);
      expect(productRepository.findById).toHaveBeenCalledWith('non-existent-id');
      expect(productRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error if repository update fails', async () => {
      jest.spyOn(productRepository, 'update').mockRejectedValueOnce(new Error('Database error'));

      const command = {
        id: mockProductId,
        stock: 8,
      };

      await expect(useCase.execute(command)).rejects.toThrow('Database error');
      expect(productRepository.findById).toHaveBeenCalledWith(mockProductId);
    });
  });
});