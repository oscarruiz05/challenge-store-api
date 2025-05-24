import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Delivery } from '../../domain/models/delivery.model';
import { DeliveryRepository } from '../../domain/repositories/delivery.repository.interface';
import { DeliveryStatusEnum } from '../../infrastructure/persistence/entities/delivery.orm';

export interface CreateDeliveryCommand {
  transaction_id: string;
  product_id: string;
  customer_id: string;
  address: string;
}

@Injectable()
export class CreateDeliveryUseCase {
  constructor(
    @Inject('DeliveryRepository')
    private readonly deliveryRepository: DeliveryRepository
  ) {}

  async execute(command: CreateDeliveryCommand): Promise<Delivery> {
    const delivery = new Delivery(
      uuidv4(),
      command.transaction_id,
      command.product_id,
      command.customer_id,
      command.address,
      DeliveryStatusEnum.PENDING,
    );

    return this.deliveryRepository.save(delivery);
  }
}