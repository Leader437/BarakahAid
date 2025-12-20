import { IsUUID, IsInt, Min, Max, IsString, IsNotEmpty } from 'class-validator';

export class CreateFeedbackDto {
  @IsUUID()
  ngoId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
