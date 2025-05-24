import { TypeOrmProductRepository } from './../../app/products/infrastructure/persistence/repositories/typeorm-product.repository';
import { Injectable, Logger } from "@nestjs/common";
import { Product } from '../../app/products/domain/models/product.model';
import * as productData from './data/products.json';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductSeeder {
  private readonly logger = new Logger(ProductSeeder.name);

  constructor(private readonly productRepository: TypeOrmProductRepository) {}

  async seed(): Promise<void> {
    this.logger.log('Iniciando seeder de productos...');
    for (const data of productData) {
      // Si el ID viene en el JSON, úsalo, sino genera uno
      const productId = uuidv4();
      const existingProduct = await this.productRepository.findById(productId);

      if (!existingProduct) {
        const product = new Product(
          productId,
          data.name,
          data.description,
          data.image,
          data.price,
          data.stock,
        );
        await this.productRepository.save(product);
        this.logger.log(`Producto "${product.name}" creado.`);
      } else {
        this.logger.log(`Producto "${existingProduct.name}" ya existe, saltando.`);
      }
    }
    this.logger.log('Seeder de productos completado.');
  }
}