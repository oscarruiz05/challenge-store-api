import { IsEnum, IsNotEmpty } from 'class-validator';
import { DeliveryStatusEnum } from '../../persistence/entities/delivery.orm';

export class UpdateDeliveryStatusDto {
  @IsNotEmpty()
  @IsEnum(DeliveryStatusEnum)
  status: DeliveryStatusEnum;
}