import { Inject, Injectable } from '@nestjs/common';
import { Delivery } from '../../domain/models/delivery.model';
import { DeliveryRepository } from '../../domain/repositories/delivery.repository.interface';

export interface UpdateDeliveryStatusCommand {
  id: string;
  status: string;
}

@Injectable()
export class UpdateDeliveryStatusUseCase {
  constructor(
    @Inject('DeliveryRepository')
    private readonly deliveryRepository: DeliveryRepository
  ) {}

  async execute(command: UpdateDeliveryStatusCommand): Promise<Delivery> {
    return this.deliveryRepository.updateStatus(command.id, command.status);
  }
}