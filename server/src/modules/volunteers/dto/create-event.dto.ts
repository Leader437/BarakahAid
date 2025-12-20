import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsArray,
  IsInt,
  IsObject,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsObject()
  location: {
    address: string;
    coordinates?: [number, number];
  };

  @IsDate()
  @Type(() => Date)
  eventDate: Date;

  @IsArray()
  @IsString({ each: true })
  requiredSkills: string[];

  @IsInt()
  @Min(1)
  maxVolunteers: number;
}
