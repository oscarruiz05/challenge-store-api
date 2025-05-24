import { Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import { v4 as uuidv4 } from 'uuid';

export interface CreateProductCommand {
  name: string;
  description: string;
  image: string;
  price: number;
  stock: number;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    const newProductId = uuidv4();

    const newProduct = new Product(
      newProductId,
      command.name,
      command.description,
      command.image,
      command.price,
      command.stock,
    );

    const createdProduct = await this.productRepository.save(newProduct);

    return createdProduct;
  }
}
