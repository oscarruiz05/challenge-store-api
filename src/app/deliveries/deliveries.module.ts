import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryOrmEntity } from './infrastructure/persistence/entities/delivery.orm';
import { TypeOrmDeliveryRepository } from './infrastructure/persistence/repositories/typeorm-delivery.repository';
import { CreateDeliveryUseCase } from './application/use-cases/create-delivery.use-case';
import { GetDeliveryUseCase } from './application/use-cases/get-delivery.use-case';
import { GetAllDeliveriesUseCase } from './application/use-cases/get-all-deliveries.use-case';
import { UpdateDeliveryStatusUseCase } from './application/use-cases/update-delivery-status.use-case';
import { DeliveryService } from './application/services/delivery.service';
import { DeliveriesController } from './infrastructure/controllers/deliveries.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryOrmEntity])],
  controllers: [DeliveriesController],
  providers: [
    {
      provide: 'DeliveryRepository',
      useClass: TypeOrmDeliveryRepository,
    },
    // use cases
    CreateDeliveryUseCase,
    GetDeliveryUseCase,
    GetAllDeliveriesUseCase,
    UpdateDeliveryStatusUseCase,
    // services
    DeliveryService,
  ],
  exports: [DeliveryService, CreateDeliveryUseCase],
})
export class DeliveriesModule {}