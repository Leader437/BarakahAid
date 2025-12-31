import { IsOptional, IsString, IsEnum, IsUUID, IsBoolean } from 'class-validator';
import { DonationRequestStatus } from '../../../common/enums/status.enum';
import { Transform } from 'class-transformer';

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

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeAll?: boolean;
}
