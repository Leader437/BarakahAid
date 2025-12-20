import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationPreferencesDto {
  @IsOptional()
  @IsBoolean()
  email?: boolean;

  @IsOptional()
  @IsBoolean()
  push?: boolean;

  @IsOptional()
  @IsBoolean()
  donations?: boolean;

  @IsOptional()
  @IsBoolean()
  campaigns?: boolean;

  @IsOptional()
  @IsBoolean()
  emergency?: boolean;
}
