import { IsEnum, IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export enum CampaignStatusAction {
  PUBLISH = 'PUBLISH',
  PAUSE = 'PAUSE',
  COMPLETE = 'COMPLETE',
  CANCEL = 'CANCEL',
}

export class UpdateCampaignStatusDto {
  @IsEnum(['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED'])
  @IsNotEmpty()
  status: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class ToggleCampaignEmergencyDto {
  @IsBoolean()
  @IsNotEmpty()
  isEmergency: boolean;
}

export class FeatureCampaignDto {
  @IsBoolean()
  @IsNotEmpty()
  isFeatured: boolean;
}
