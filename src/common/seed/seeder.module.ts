import { ProductOrmEntity } from './../../app/products/infrastructure/persistence/entities/product.orm.entity';
import { TypeOrmProductRepository } from './../../app/products/infrastructure/persistence/repositories/typeorm-product.repository';
import { ProductsModule } from './../../app/products/produtcs.module';
import { Module } from '@nestjs/common';
import { ProductSeeder } from './product.seeder';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([ProductOrmEntity]),
    ProductsModule,
  ],
  providers: [ProductSeeder, TypeOrmProductRepository],
  exports: [ProductSeeder],
})
export class SeederModule {}
