import { Inject, Injectable } from '@nestjs/common';
import { Delivery } from '../../domain/models/delivery.model';
import { DeliveryRepository } from '../../domain/repositories/delivery.repository.interface';

@Injectable()
export class GetDeliveryUseCase {
  constructor(
    @Inject('DeliveryRepository')
    private readonly deliveryRepository: DeliveryRepository
  ) {}

  async execute(id: string): Promise<Delivery | null> {
    return this.deliveryRepository.findById(id);
  }
}