import { IsArray, IsString, IsOptional } from 'class-validator';

export class UpdateVolunteerProfileDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsString()
  availability?: string;
}
