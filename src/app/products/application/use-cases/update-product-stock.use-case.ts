import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ProductRepository } from "../../domain/repositories/product.repository.interface";
import { Product } from "../../domain/models/product.model";

export interface UpdateProductStockCommand {
  id: string;
  stock: number;
}

@Injectable()
export class UpdateProductStockUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: UpdateProductStockCommand): Promise<Product> {
    const existingProduct = await this.productRepository.findById(command.id);

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${command.id} not found.`);
    }

    existingProduct.stock = command.stock;
    return this.productRepository.update(existingProduct);
  }
}
