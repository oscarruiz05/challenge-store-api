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
}
