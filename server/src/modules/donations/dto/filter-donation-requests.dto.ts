import { IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';
import { DonationRequestStatus } from '../../../common/enums/status.enum';

export class FilterDonationRequestsDto {
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsEnum(DonationRequestStatus)
  status?: DonationRequestStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
