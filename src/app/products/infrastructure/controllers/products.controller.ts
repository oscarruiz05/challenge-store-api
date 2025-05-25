import { Controller, Body, Get, Param, Put } from '@nestjs/common';
import { ProductService } from '../../application/services/product.service';
import { Product } from '../../domain/models/product.model';
import { updateStockProductDto } from './dtos/update-stock-product.dto';
import { UpdateProductStockCommand } from '../../application/use-cases/update-product-stock.use-case';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product | null> {
    return this.productService.getProductById(id);
  }

  @Put(':id/stock')
  async updateStockProduct(
    @Param('id') id: string,
    @Body() updateStockProductDto: updateStockProductDto,
  ): Promise<Product> {
    const command: UpdateProductStockCommand = { ...updateStockProductDto, id };
    return this.productService.updateProduct(command);
  }
}
