import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class UpdateStockProductDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;
}