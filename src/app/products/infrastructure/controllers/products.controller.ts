import { Controller, Body, Get, Param, Put, Post, Delete } from '@nestjs/common';
import { ProductService } from '../../application/services/product.service';
import { Product } from '../../domain/models/product.model';
import { UpdateStockProductDto } from './dtos/update-stock-product.dto';
import { UpdateProductStockCommand } from '../../application/use-cases/update-product-stock.use-case';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product | null> {
    return this.productService.getProductById(id);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct({ ...updateProductDto, id });
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productService.deleteProduct(id);
  }

  @Put(':id/stock')
  async updateProductStock(
    @Param('id') id: string,
    @Body() updateStockProductDto: UpdateStockProductDto,
  ): Promise<Product> {
    const command: UpdateProductStockCommand = { ...updateStockProductDto, id };
    return this.productService.updateProductStock(command);
  }
}