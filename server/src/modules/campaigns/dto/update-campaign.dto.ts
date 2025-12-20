import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { CampaignStatus } from '../../../common/enums/status.enum';

export class UpdateCampaignDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  goalAmount?: number;

  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;
}
