import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from './infrastructure/persistence/entities/product.orm.entity';
import { TypeOrmProductRepository } from './infrastructure/persistence/repositories/typeorm-product.repository';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { GetAllProductsUseCase } from './application/use-cases/get-all-products.use-case';
import { GetProductUseCase } from './application/use-cases/get-product.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case';
import { ProductsController } from './infrastructure/controllers/products.controller';
import { ProductService } from './application/services/product.service';
import { UpdateProductStockUseCase } from './application/use-cases/update-product-stock.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  controllers: [ProductsController],
  providers: [
    {
      provide: 'ProductRepository',
      useClass: TypeOrmProductRepository,
    },
    // use-cases
    CreateProductUseCase,
    GetAllProductsUseCase,
    GetProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    UpdateProductStockUseCase,
    // services
    ProductService,
  ],
  exports: ['ProductRepository', GetProductUseCase, UpdateProductStockUseCase],
})
export class ProductsModule {}