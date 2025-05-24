import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';

export interface UpdateProductCommand {
  id: string;
  name?: string;
  description?: string;
  image?: string;
  price?: number;
  stock?: number;
}

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: UpdateProductCommand): Promise<Product> {
    const existingProduct = await this.productRepository.findById(command.id);

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${command.id} not found.`);
    }

    existingProduct.name = command.name ?? existingProduct.name;
    existingProduct.description =
      command.description ?? existingProduct.description;
    existingProduct.image = command.image ?? existingProduct.image;
    existingProduct.price = command.price ?? existingProduct.price;
    existingProduct.stock = command.stock ?? existingProduct.stock;

    return this.productRepository.update(existingProduct);
  }
}
