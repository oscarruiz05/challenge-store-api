import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { CreateProductUseCase } from '../use-cases/create-product.use-case';
import { GetProductUseCase } from '../use-cases/get-product.use-case';
import { GetAllProductsUseCase } from '../use-cases/get-all-products.use-case';
import { UpdateProductUseCase } from '../use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../use-cases/delete-product.use-case';
import { UpdateProductStockUseCase } from '../use-cases/update-product-stock.use-case';
import { Product } from '../../domain/models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let createProductUseCase: CreateProductUseCase;
  let getProductUseCase: GetProductUseCase;
  let getAllProductsUseCase: GetAllProductsUseCase;
  let updateProductUseCase: UpdateProductUseCase;
  let deleteProductUseCase: DeleteProductUseCase;
  let updateProductStockUseCase: UpdateProductStockUseCase;

  const mockProductId = '123e4567-e89b-12d3-a456-426614174000';
  const mockProduct = new Product(
    mockProductId,
    'Test Product',
    'Test Description',
    'test-image.jpg',
    100,
    10
  );

  const mockProducts = [
    mockProduct,
    new Product('2', 'Product 2', 'Description 2', 'image2.jpg', 200, 20),
    new Product('3', 'Product 3', 'Description 3', 'image3.jpg', 300, 30),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: CreateProductUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockProduct),
          },
        },
        {
          provide: GetProductUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockProduct),
          },
        },
        {
          provide: GetAllProductsUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockProducts),
          },
        },
        {
          provide: UpdateProductUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockProduct),
          },
        },
        {
          provide: DeleteProductUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: UpdateProductStockUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockProduct),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    createProductUseCase = module.get<CreateProductUseCase>(CreateProductUseCase);
    getProductUseCase = module.get<GetProductUseCase>(GetProductUseCase);
    getAllProductsUseCase = module.get<GetAllProductsUseCase>(GetAllProductsUseCase);
    updateProductUseCase = module.get<UpdateProductUseCase>(UpdateProductUseCase);
    deleteProductUseCase = module.get<DeleteProductUseCase>(DeleteProductUseCase);
    updateProductStockUseCase = module.get<UpdateProductStockUseCase>(UpdateProductStockUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should call createProductUseCase.execute with the correct parameters', async () => {
      const createProductCommand = {
        name: 'Test Product',
        description: 'Test Description',
        image: 'test-image.jpg',
        price: 100,
        stock: 10,
      };

      const result = await service.createProduct(createProductCommand);

      expect(createProductUseCase.execute).toHaveBeenCalledWith(createProductCommand);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('getProductById', () => {
    it('should call getProductUseCase.execute with the correct parameters', async () => {
      const result = await service.getProductById(mockProductId);

      expect(getProductUseCase.execute).toHaveBeenCalledWith(mockProductId);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('getAllProducts', () => {
    it('should call getAllProductsUseCase.execute', async () => {
      const result = await service.getAllProducts();

      expect(getAllProductsUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
      expect(result.length).toBe(3);
    });
  });

  describe('updateProduct', () => {
    it('should call updateProductUseCase.execute with the correct parameters', async () => {
      const updateProductCommand = {
        id: mockProductId,
        name: 'Updated Product',
        description: 'Updated Description',
        image: 'updated-image.jpg',
        price: 150,
        stock: 15,
      };

      const result = await service.updateProduct(updateProductCommand);

      expect(updateProductUseCase.execute).toHaveBeenCalledWith(updateProductCommand);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should call deleteProductUseCase.execute with the correct parameters', async () => {
      await service.deleteProduct(mockProductId);

      expect(deleteProductUseCase.execute).toHaveBeenCalledWith(mockProductId);
    });
  });

  describe('updateProductStock', () => {
    it('should call updateProductStockUseCase.execute with the correct parameters', async () => {
      const updateStockCommand = {
        id: mockProductId,
        stock: 8,
      };

      const result = await service.updateProductStock(updateStockCommand);

      expect(updateProductStockUseCase.execute).toHaveBeenCalledWith(updateStockCommand);
      expect(result).toEqual(mockProduct);
    });
  });
});