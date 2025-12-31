import {
  IsString,
  IsOptional,
  IsDate,
  IsArray,
  IsInt,
  IsObject,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
  location?: {
    address: string;
    coordinates?: [number, number];
  };

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  eventDate?: Date;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
  requiredSkills?: string[];

  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : value)
  maxVolunteers?: number;
}
