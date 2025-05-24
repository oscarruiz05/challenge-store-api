import { Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/models/product.model';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }
}
