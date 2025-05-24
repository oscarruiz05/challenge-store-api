import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from 'src/app/products/domain/repositories/product.repository.interface';
import { ProductOrmEntity } from '../entities/product.orm.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/app/products/domain/models/product.model';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly productRepository: Repository<ProductOrmEntity>,
  ) {}

  async findById(id: string): Promise<Product | null> {
    const ormEntity = await this.productRepository.findOneBy({ id });
    return ormEntity ? ProductMapper.toDomain(ormEntity) : null;
  }

  async findAll(): Promise<Product[]> {
    const ormEntities = await this.productRepository.find();
    return ormEntities.map(ProductMapper.toDomain);
  }

  async save(product: Product): Promise<Product> {
    const ormEntity = ProductMapper.fromDomain(product);
    const savedOrmEntity = await this.productRepository.save(ormEntity);
    return ProductMapper.toDomain(savedOrmEntity);
  }

  async update(product: Product): Promise<Product> {
    const ormEntity = ProductMapper.fromDomain(product);
    const updatedOrmEntity = await this.productRepository.save(ormEntity);
    return ProductMapper.toDomain(updatedOrmEntity);
  }

  async delete(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}
