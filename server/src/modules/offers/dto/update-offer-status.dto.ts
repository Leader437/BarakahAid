import { IsEnum } from 'class-validator';
import { DonationOfferStatus } from '../../../common/enums/status.enum';

export class UpdateOfferStatusDto {
  @IsEnum(DonationOfferStatus)
  status: DonationOfferStatus;
}
