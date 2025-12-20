import { IsEnum } from 'class-validator';
import { VerificationStatus } from '../../../common/enums/status.enum';

export class UpdateVerificationStatusDto {
  @IsEnum(VerificationStatus)
  status: VerificationStatus;
}
