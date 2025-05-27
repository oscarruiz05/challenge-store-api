import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductUseCase } from './create-product.use-case';
import { ProductRepository } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/models/product.model';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid');

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let productRepository: ProductRepository;

  const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
  const mockProduct = new Product(
    mockUuid,
    'Test Product',
    'Test Description',
    'test-image.jpg',
    100,
    10
  );

  beforeEach(async () => {
    jest.clearAllMocks();
    (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductUseCase,
        {
          provide: 'ProductRepository',
          useValue: {
            save: jest.fn().mockResolvedValue(mockProduct),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateProductUseCase>(CreateProductUseCase);
    productRepository = module.get<ProductRepository>('ProductRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new product successfully', async () => {
      const command = {
        name: 'Test Product',
        description: 'Test Description',
        image: 'test-image.jpg',
        price: 100,
        stock: 10,
      };

      const result = await useCase.execute(command);

      expect(uuidv4).toHaveBeenCalled();
      expect(productRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockUuid,
          name: command.name,
          description: command.description,
          image: command.image,
          price: command.price,
          stock: command.stock,
        }),
      );
      expect(result).toEqual(mockProduct);
    });

    it('should throw an error if repository save fails', async () => {
      const command = {
        name: 'Test Product',
        description: 'Test Description',
        image: 'test-image.jpg',
        price: 100,
        stock: 10,
      };

      jest.spyOn(productRepository, 'save').mockRejectedValueOnce(new Error('Database error'));

      await expect(useCase.execute(command)).rejects.toThrow('Database error');
    });
  });
});