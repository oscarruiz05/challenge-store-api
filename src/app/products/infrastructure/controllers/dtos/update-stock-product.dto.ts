import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class updateStockProductDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;
}