import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity('customers')
export class CustomerOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string = uuidv4();

  @Column()
  name: string;

  @Column()
  last_name: string;

  @Column({unique: true})
  email: string;

  @Column({nullable: true})
  number_phone: string;

  @Column({nullable: true})
  address: string;
}