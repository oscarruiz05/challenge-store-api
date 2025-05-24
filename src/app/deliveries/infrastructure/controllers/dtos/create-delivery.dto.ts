import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDeliveryDto {
  @IsNotEmpty()
  @IsUUID()
  transaction_id: string;

  @IsNotEmpty()
  @IsUUID()
  product_id: string;

  @IsNotEmpty()
  @IsUUID()
  customer_id: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}