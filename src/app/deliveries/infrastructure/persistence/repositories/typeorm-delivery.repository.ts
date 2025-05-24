import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from '../../../domain/models/delivery.model';
import { DeliveryRepository } from '../../../domain/repositories/delivery.repository.interface';
import { DeliveryOrmEntity, DeliveryStatusEnum } from '../entities/delivery.orm';
import { DeliveryMapper } from '../mappers/delivery.mapper';

@Injectable()
export class TypeOrmDeliveryRepository implements DeliveryRepository {
  constructor(
    @InjectRepository(DeliveryOrmEntity)
    private readonly deliveryRepository: Repository<DeliveryOrmEntity>,
  ) {}

  async findById(id: string): Promise<Delivery | null> {
    const deliveryEntity = await this.deliveryRepository.findOne({
      where: { id },
    });
    return deliveryEntity ? DeliveryMapper.toDomain(deliveryEntity) : null;
  }

  async findAll(): Promise<Delivery[]> {
    const deliveryEntities = await this.deliveryRepository.find();
    return deliveryEntities.map(DeliveryMapper.toDomain);
  }

  async save(delivery: Delivery): Promise<Delivery> {
    const deliveryEntity = DeliveryMapper.toOrmEntity(delivery);
    const savedEntity = await this.deliveryRepository.save(deliveryEntity);
    return DeliveryMapper.toDomain(savedEntity);
  }

  async update(delivery: Delivery): Promise<Delivery> {
    const existingDelivery = await this.deliveryRepository.findOne({
      where: { id: delivery.id },
    });

    if (!existingDelivery) {
      throw new Error(`Delivery with id ${delivery.id} not found`);
    }

    const deliveryEntity = DeliveryMapper.toOrmEntity(delivery);
    deliveryEntity.created_at = existingDelivery.created_at;
    deliveryEntity.updated_at = new Date();

    const updatedEntity = await this.deliveryRepository.save(deliveryEntity);
    return DeliveryMapper.toDomain(updatedEntity);
  }

  async updateStatus(id: string, status: string): Promise<Delivery> {
    const existingDelivery = await this.deliveryRepository.findOne({
      where: { id },
    });

    if (!existingDelivery) {
      throw new Error(`Delivery with id ${id} not found`);
    }

    existingDelivery.status = status as DeliveryStatusEnum;
    existingDelivery.updated_at = new Date();

    const updatedEntity = await this.deliveryRepository.save(existingDelivery);
    return DeliveryMapper.toDomain(updatedEntity);
  }
}