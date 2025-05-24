import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { CreateCustomerCommand } from './../../../application/use-cases/create-customer.use-case';

export class CreateCustomerDto implements CreateCustomerCommand {
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
