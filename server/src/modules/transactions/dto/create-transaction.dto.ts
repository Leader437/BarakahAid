import { IsUUID, IsNumber, IsEnum, IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentGateway } from '../../../common/enums/status.enum';

export class CreateTransactionDto {
  @IsUUID()
  @IsOptional()
  campaignId?: string;

  @IsUUID()
  @IsOptional()
  requestId?: string;

  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsEnum(PaymentGateway)
  paymentGateway: PaymentGateway;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsEmail()
  @IsOptional()
  donorEmail?: string;

  @IsString()
  @IsOptional()
  donorName?: string;

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;
}
