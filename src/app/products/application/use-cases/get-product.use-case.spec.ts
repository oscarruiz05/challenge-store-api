import { Test, TestingModule } from '@nestjs/testing';
import { GetProductUseCase } from './get-product.use-case';
import { ProductRepository } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/models/product.model';

describe('GetProductUseCase', () => {
  let useCase: GetProductUseCase;
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductUseCase,
        {
          provide: 'ProductRepository',
          useValue: {
            findById: jest.fn().mockResolvedValue(mockProduct),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetProductUseCase>(GetProductUseCase);
    productRepository = module.get<ProductRepository>('ProductRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a product when found by id', async () => {
      const result = await useCase.execute(mockProductId);

      expect(productRepository.findById).toHaveBeenCalledWith(mockProductId);
      expect(result).toEqual(mockProduct);
    });

    it('should return null when product is not found', async () => {
      jest.spyOn(productRepository, 'findById').mockResolvedValueOnce(null);

      const result = await useCase.execute('non-existent-id');

      expect(productRepository.findById).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeNull();
    });

    it('should throw an error if repository findById fails', async () => {
      jest.spyOn(productRepository, 'findById').mockRejectedValueOnce(new Error('Database error'));

      await expect(useCase.execute(mockProductId)).rejects.toThrow('Database error');
    });
  });
});