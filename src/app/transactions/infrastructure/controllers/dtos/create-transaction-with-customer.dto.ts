import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsObject, IsPositive, IsString, IsUUID, ValidateNested } from 'class-validator';
import { CreateCustomerDto } from '../../../../customers/infrastructure/controllers/dtos/create-customer.dto';

export class CreateTransactionWithCustomerDto {
  @IsNotEmpty()
  @IsUUID()
  product_id: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  card_token: string;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateCustomerDto)
  customer: CreateCustomerDto;
}