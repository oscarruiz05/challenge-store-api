import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateCustomerDto } from '../../../../customers/infrastructure/controllers/dtos/create-customer.dto';

export class CreateTransactionDto {
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

  @IsNotEmpty()
  @IsString()
  acceptance_token: string;

  @IsNotEmpty()
  @IsString()
  accept_personal_auth: string;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateCustomerDto)
  customer: CreateCustomerDto;
}
