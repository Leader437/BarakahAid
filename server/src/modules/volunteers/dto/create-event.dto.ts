import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsArray,
  IsInt,
  IsObject,
  Min,
  IsOptional,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsObject()
  @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
  location: {
    address: string;
    coordinates?: [number, number];
  };

  @IsDate()
  @Type(() => Date)
  eventDate: Date;

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
  requiredSkills: string[];

  @IsInt()
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : value)
  @Min(1)
  maxVolunteers: number;
}
