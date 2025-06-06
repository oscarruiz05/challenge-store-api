import { Injectable } from '@nestjs/common';
import {
  CreateProductCommand,
  CreateProductUseCase,
} from '../use-cases/create-product.use-case';
import { Product } from '../../domain/models/product.model';
import { GetProductUseCase } from '../use-cases/get-product.use-case';
import { GetAllProductsUseCase } from '../use-cases/get-all-products.use-case';
import {
  UpdateProductCommand,
  UpdateProductUseCase,
} from '../use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../use-cases/delete-product.use-case';
import { UpdateProductStockCommand, UpdateProductStockUseCase } from '../use-cases/update-product-stock.use-case';

@Injectable()
export class ProductService {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly updateProductStockUseCase: UpdateProductStockUseCase
  ) {}

  async createProduct(command: CreateProductCommand): Promise<Product> {
    return this.createProductUseCase.execute(command);
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.getProductUseCase.execute(id);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.getAllProductsUseCase.execute();
  }

  async updateProduct(command: UpdateProductCommand): Promise<Product> {
    return this.updateProductUseCase.execute(command);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.deleteProductUseCase.execute(id);
  }

  async updateProductStock(command: UpdateProductStockCommand): Promise<Product> {
    return this.updateProductStockUseCase.execute(command);
  }
}
