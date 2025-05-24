import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from 'src/app/products/domain/repositories/product.repository';
import { ProductOrmEntity } from '../entities/product.orm.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/app/products/domain/entities/product.entity';

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly productRepository: Repository<ProductOrmEntity>,
  ) {}

  async findById(id: string): Promise<Product | null> {
    const ormEntity = await this.productRepository.findOneBy({ id });
    return ormEntity ? ormEntity.toDomain() : null;
  }

  async findAll(): Promise<Product[]> {
    const ormEntities = await this.productRepository.find();
    return ormEntities.map((entity) => entity.toDomain());
  }

  async save(product: Product): Promise<Product> {
    const ormEntity = ProductOrmEntity.fromDomain(product);
    const savedOrmEntity = await this.productRepository.save(ormEntity);
    return savedOrmEntity.toDomain();
  }

  async update(product: Product): Promise<Product> {
    const ormEntity = ProductOrmEntity.fromDomain(product);
    const updatedOrmEntity = await this.productRepository.save(ormEntity);
    return updatedOrmEntity.toDomain();
  }

  async delete(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}
