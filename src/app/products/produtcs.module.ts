import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from './infrastructure/persistence/entities/product.orm.entity';
import { TypeOrmProductRepository } from './infrastructure/persistence/repositories/typeorm-product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  controllers: [],
  providers: [
    {
      provide: 'ProductRepository',
      useClass: TypeOrmProductRepository,
    },
  ],
  exports: ['ProductRepository'],
})
export class ProductsModule {}
