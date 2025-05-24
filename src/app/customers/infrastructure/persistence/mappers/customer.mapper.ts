import { CustomerOrmEntity } from '../entities/customer.orm.entity';
import { Customer } from './../../../domain/models/customer.model';
export class CustomerMapper {
  static fromDomain(customer: Customer): CustomerOrmEntity {
    const ormEntity = new CustomerOrmEntity();
    ormEntity.id = customer.id;
    ormEntity.name = customer.name;
    ormEntity.last_name = customer.last_name;
    ormEntity.email = customer.email;
    ormEntity.number_phone = customer.number_phone;
    ormEntity.address = customer.address;
    return ormEntity;
  }

  static toDomain(orm: CustomerOrmEntity): Customer {
    return new Customer(
      orm.id,
      orm.name,
      orm.last_name,
      orm.email,
      orm.number_phone,
      orm.address,
    );
  }
}
