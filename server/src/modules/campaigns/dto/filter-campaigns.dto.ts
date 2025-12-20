import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { CampaignStatus } from '../../../common/enums/status.enum';

export class FilterCampaignsDto {
  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isEmergency?: boolean;

  @IsOptional()
  @IsString()
  search?: string;
}
