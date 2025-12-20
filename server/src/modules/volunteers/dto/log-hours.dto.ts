import { IsInt, Min } from 'class-validator';

export class LogHoursDto {
  @IsInt()
  @Min(1)
  hours: number;
}
