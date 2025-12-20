import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateOfferDto {
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
