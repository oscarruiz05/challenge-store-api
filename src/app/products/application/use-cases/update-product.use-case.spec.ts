import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProductUseCase } from './update-product.use-case';
import { ProductRepository } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/models/product.model';
import { NotFoundException } from '@nestjs/common';

describe('UpdateProductUseCase', () => {
  let useCase: UpdateProductUseCase;
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
    'Updated Product',
    'Updated Description',
    'updated-image.jpg',
    150,
    15
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProductUseCase,
        {
          provide: 'ProductRepository',
          useValue: {
            findById: jest.fn().mockResolvedValue(mockProduct),
            update: jest.fn().mockResolvedValue(updatedMockProduct),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateProductUseCase>(UpdateProductUseCase);
    productRepository = module.get<ProductRepository>('ProductRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update a product successfully', async () => {
      const command = {
        id: mockProductId,
        name: 'Updated Product',
        description: 'Updated Description',
        image: 'updated-image.jpg',
        price: 150,
        stock: 15,
      };

      const result = await useCase.execute(command);

      expect(productRepository.findById).toHaveBeenCalledWith(mockProductId);
      expect(productRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockProductId,
          name: command.name,
          description: command.description,
          image: command.image,
          price: command.price,
          stock: command.stock,
        }),
      );
      expect(result).toEqual(updatedMockProduct);
    });

    it('should throw NotFoundException when product is not found', async () => {
      jest.spyOn(productRepository, 'findById').mockResolvedValueOnce(null);

      const command = {
        id: 'non-existent-id',
        name: 'Updated Product',
        description: 'Updated Description',
        image: 'updated-image.jpg',
        price: 150,
        stock: 15,
      };

      await expect(useCase.execute(command)).rejects.toThrow(NotFoundException);
      expect(productRepository.findById).toHaveBeenCalledWith('non-existent-id');
      expect(productRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error if repository update fails', async () => {
      jest.spyOn(productRepository, 'update').mockRejectedValueOnce(new Error('Database error'));

      const command = {
        id: mockProductId,
        name: 'Updated Product',
        description: 'Updated Description',
        image: 'updated-image.jpg',
        price: 150,
        stock: 15,
      };

      await expect(useCase.execute(command)).rejects.toThrow('Database error');
      expect(productRepository.findById).toHaveBeenCalledWith(mockProductId);
    });
  });
});