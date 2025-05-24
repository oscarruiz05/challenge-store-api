import { Product } from './../../../domain/entities/product.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('products')
export class ProductOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string = uuidv4();

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  image: string;

  @Column('decimal')
  price: number;

  @Column('int')
  stock: number;

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

  toDomain(): Product {
    return new Product(
      this.id,
      this.name,
      this.description,
      this.image,
      this.price,
      this.stock,
    );
  }
}
