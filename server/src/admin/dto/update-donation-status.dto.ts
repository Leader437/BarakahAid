import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum DonationStatusAction {
  COMPLETE = 'COMPLETE',
  REFUND = 'REFUND',
  CANCEL = 'CANCEL',
}

export class UpdateDonationStatusDto {
  @IsEnum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'])
  @IsNotEmpty()
  status: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class RefundDonationDto {
  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
