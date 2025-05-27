import { Test, TestingModule } from '@nestjs/testing';
import { DeleteProductUseCase } from './delete-product.use-case';
import { ProductRepository } from '../../domain/repositories/product.repository.interface';
import { NotFoundException } from '@nestjs/common';

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;
  let productRepository: ProductRepository;

  const mockProductId = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProductUseCase,
        {
          provide: 'ProductRepository',
          useValue: {
            findById: jest.fn().mockResolvedValue({ id: mockProductId }),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    useCase = module.get<DeleteProductUseCase>(DeleteProductUseCase);
    productRepository = module.get<ProductRepository>('ProductRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should delete a product successfully', async () => {
      await useCase.execute(mockProductId);

      expect(productRepository.findById).toHaveBeenCalledWith(mockProductId);
      expect(productRepository.delete).toHaveBeenCalledWith(mockProductId);
    });

    it('should throw NotFoundException when product is not found', async () => {
      jest.spyOn(productRepository, 'findById').mockResolvedValueOnce(null);

      await expect(useCase.execute('non-existent-id')).rejects.toThrow(NotFoundException);
      expect(productRepository.findById).toHaveBeenCalledWith('non-existent-id');
      expect(productRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw an error if repository delete fails', async () => {
      jest.spyOn(productRepository, 'delete').mockRejectedValueOnce(new Error('Database error'));

      await expect(useCase.execute(mockProductId)).rejects.toThrow('Database error');
      expect(productRepository.findById).toHaveBeenCalledWith(mockProductId);
      expect(productRepository.delete).toHaveBeenCalledWith(mockProductId);
    });
  });
});