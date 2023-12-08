import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class createProductDTO {
  @IsNotEmpty()
  @IsString()
  productName: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(100)
  productPrice: number;

  productImage: string;
}
