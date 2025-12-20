import { IsArray, IsString, IsOptional } from 'class-validator';

export class CreateVolunteerProfileDto {
  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsOptional()
  @IsString()
  availability?: string;
}
