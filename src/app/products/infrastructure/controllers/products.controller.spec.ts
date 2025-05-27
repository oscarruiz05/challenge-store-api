import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductService } from '../../application/services/product.service';
import { Product } from '../../domain/models/product.model';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { UpdateStockProductDto } from './dtos/update-stock-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productService: ProductService;

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
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            createProduct: jest.fn().mockResolvedValue(mockProduct),
            getProductById: jest.fn().mockResolvedValue(mockProduct),
            getAllProducts: jest.fn().mockResolvedValue(mockProducts),
            updateProduct: jest.fn().mockResolvedValue(mockProduct),
            deleteProduct: jest.fn().mockResolvedValue(undefined),
            updateProductStock: jest.fn().mockResolvedValue(mockProduct),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        image: 'test-image.jpg',
        price: 100,
        stock: 10,
      };

      const result = await controller.createProduct(createProductDto);

      expect(productService.createProduct).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('getProductById', () => {
    it('should get a product by id successfully', async () => {
      const result = await controller.getProductById(mockProductId);

      expect(productService.getProductById).toHaveBeenCalledWith(mockProductId);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('getAllProducts', () => {
    it('should get all products successfully', async () => {
      const result = await controller.getAllProducts();

      expect(productService.getAllProducts).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
      expect(result.length).toBe(3);
    });
  });

  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        description: 'Updated Description',
        image: 'updated-image.jpg',
        price: 150,
        stock: 15,
      };

      const result = await controller.updateProduct(mockProductId, updateProductDto);

      expect(productService.updateProduct).toHaveBeenCalledWith({
        id: mockProductId,
        ...updateProductDto,
      });
      expect(result).toEqual(mockProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      await controller.deleteProduct(mockProductId);

      expect(productService.deleteProduct).toHaveBeenCalledWith(mockProductId);
    });
  });

  describe('updateProductStock', () => {
    it('should update product stock successfully', async () => {
      const updateStockProductDto: UpdateStockProductDto = {
        stock: 8,
      };

      const result = await controller.updateProductStock(mockProductId, updateStockProductDto);

      expect(productService.updateProductStock).toHaveBeenCalledWith({
        id: mockProductId,
        stock: updateStockProductDto.stock,
      });
      expect(result).toEqual(mockProduct);
    });
  });
});