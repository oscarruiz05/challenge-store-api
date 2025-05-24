import { Injectable } from '@nestjs/common';
import { Delivery } from '../../domain/models/delivery.model';
import { CreateDeliveryCommand, CreateDeliveryUseCase } from '../use-cases/create-delivery.use-case';
import { GetDeliveryUseCase } from '../use-cases/get-delivery.use-case';
import { GetAllDeliveriesUseCase } from '../use-cases/get-all-deliveries.use-case';
import { UpdateDeliveryStatusCommand, UpdateDeliveryStatusUseCase } from '../use-cases/update-delivery-status.use-case';

@Injectable()
export class DeliveryService {
  constructor(
    private readonly createDeliveryUseCase: CreateDeliveryUseCase,
    private readonly getDeliveryUseCase: GetDeliveryUseCase,
    private readonly getAllDeliveriesUseCase: GetAllDeliveriesUseCase,
    private readonly updateDeliveryStatusUseCase: UpdateDeliveryStatusUseCase,
  ) {}

  async createDelivery(command: CreateDeliveryCommand): Promise<Delivery> {
    return this.createDeliveryUseCase.execute(command);
  }

  async getDeliveryById(id: string): Promise<Delivery | null> {
    return this.getDeliveryUseCase.execute(id);
  }

  async getAllDeliveries(): Promise<Delivery[]> {
    return this.getAllDeliveriesUseCase.execute();
  }

  async updateDeliveryStatus(command: UpdateDeliveryStatusCommand): Promise<Delivery> {
    return this.updateDeliveryStatusUseCase.execute(command);
  }
}