import { IsString, IsOptional, IsEnum } from 'class-validator';
import { DonationRequestStatus } from '../../../common/enums/status.enum';

export class UpdateDonationRequestDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(DonationRequestStatus)
  status?: DonationRequestStatus;
}
