import { Delivery } from '../../../../deliveries/domain/models/delivery.model';
import { DeliveryOrmEntity } from '../entities/delivery.orm';

export class DeliveryMapper {
  static toDomain(ormEntity: DeliveryOrmEntity): Delivery {
    return new Delivery(
      ormEntity.id,
      ormEntity.transaction_id,
      ormEntity.product_id,
      ormEntity.customer_id,
      ormEntity.address,
      ormEntity.status,
    );
  }

  static toOrmEntity(domain: Delivery): DeliveryOrmEntity {
    const ormEntity = new DeliveryOrmEntity();
    ormEntity.id = domain.id;
    ormEntity.transaction_id = domain.transaction_id;
    ormEntity.product_id = domain.product_id;
    ormEntity.customer_id = domain.customer_id;
    ormEntity.address = domain.address;
    ormEntity.status = domain.status;
    ormEntity.updated_at = new Date();
    return ormEntity;
  }
}