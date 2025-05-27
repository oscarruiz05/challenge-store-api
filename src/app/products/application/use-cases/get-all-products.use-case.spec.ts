import { Test, TestingModule } from '@nestjs/testing';
import { GetAllProductsUseCase } from './get-all-products.use-case';
import { ProductRepository } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/models/product.model';

describe('GetAllProductsUseCase', () => {
  let useCase: GetAllProductsUseCase;
  let productRepository: ProductRepository;

  const mockProducts = [
    new Product('1', 'Product 1', 'Description 1', 'image1.jpg', 100, 10),
    new Product('2', 'Product 2', 'Description 2', 'image2.jpg', 200, 20),
    new Product('3', 'Product 3', 'Description 3', 'image3.jpg', 300, 30),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllProductsUseCase,
        {
          provide: 'ProductRepository',
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockProducts),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetAllProductsUseCase>(GetAllProductsUseCase);
    productRepository = module.get<ProductRepository>('ProductRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return all products', async () => {
      const result = await useCase.execute();

      expect(productRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
      expect(result.length).toBe(3);
    });

    it('should return empty array when no products exist', async () => {
      jest.spyOn(productRepository, 'findAll').mockResolvedValueOnce([]);

      const result = await useCase.execute();

      expect(productRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should throw an error if repository findAll fails', async () => {
      jest.spyOn(productRepository, 'findAll').mockRejectedValueOnce(new Error('Database error'));

      await expect(useCase.execute()).rejects.toThrow('Database error');
    });
  });
});