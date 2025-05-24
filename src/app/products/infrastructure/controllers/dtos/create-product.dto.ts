import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductCommand } from '../../../application/use-cases/create-product.use-case';

export class CreateProductDto implements CreateProductCommand {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock: number;
}
