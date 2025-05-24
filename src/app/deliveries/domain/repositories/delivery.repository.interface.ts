import { Delivery } from '../models/delivery.model';

export interface DeliveryRepository {
  findById(id: string): Promise<Delivery | null>;
  findAll(): Promise<Delivery[]>;
  save(delivery: Delivery): Promise<Delivery>;
  update(delivery: Delivery): Promise<Delivery>;
  updateStatus(id: string, status: string): Promise<Delivery>;
}