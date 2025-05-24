import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateProductCommand } from '../../../application/use-cases/update-product.use-case';

export class UpdateProductDto implements UpdateProductCommand {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  stock?: number;
}
