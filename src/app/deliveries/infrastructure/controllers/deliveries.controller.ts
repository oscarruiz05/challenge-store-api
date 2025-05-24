import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DeliveryService } from '../../application/services/delivery.service';
import { CreateDeliveryCommand } from '../../application/use-cases/create-delivery.use-case';
import { Delivery } from '../../domain/models/delivery.model';
import { UpdateDeliveryStatusCommand } from '../../application/use-cases/update-delivery-status.use-case';
import { CreateDeliveryDto } from './dtos/create-delivery.dto';
import { UpdateDeliveryStatusDto } from './dtos/update-delivery-status.dto';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createDelivery(
    @Body() createDeliveryDto: CreateDeliveryDto,
  ): Promise<Delivery> {
    const command: CreateDeliveryCommand = createDeliveryDto;
    return this.deliveryService.createDelivery(command);
  }

  @Get(':id')
  async getDeliveryById(@Param('id') id: string): Promise<Delivery | null> {
    return this.deliveryService.getDeliveryById(id);
  }

  @Get()
  async getAllDeliveries(): Promise<Delivery[]> {
    return this.deliveryService.getAllDeliveries();
  }

  @Put(':id/status')
  async updateDeliveryStatus(
    @Param('id') id: string,
    @Body() updateDeliveryStatusDto: UpdateDeliveryStatusDto,
  ): Promise<Delivery> {
    const command: UpdateDeliveryStatusCommand = { 
      id, 
      status: updateDeliveryStatusDto.status 
    };
    return this.deliveryService.updateDeliveryStatus(command);
  }
}