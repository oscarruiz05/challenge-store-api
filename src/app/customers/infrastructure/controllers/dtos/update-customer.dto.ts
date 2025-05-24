import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';
import { UpdateCustomerCommand } from './../../../application/use-cases/update-customer.use-case';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateCustomerDto implements UpdateCustomerCommand {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  number_phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
