import { ProductOrmEntity } from '../entities/product.orm.entity';
import { Product } from './../../../domain/models/product.model';
export class ProductMapper {
  static fromDomain(product: Product): ProductOrmEntity {
    const ormEntity = new ProductOrmEntity();
    ormEntity.id = product.id;
    ormEntity.name = product.name;
    ormEntity.description = product.description;
    ormEntity.image = product.image;
    ormEntity.price = product.price;
    ormEntity.stock = product.stock;
    return ormEntity;
  }

  static toDomain(orm: ProductOrmEntity): Product {
    return new Product(
      orm.id,
      orm.name,
      orm.description,
      orm.image,
      orm.price,
      orm.stock,
    );
  }
}
