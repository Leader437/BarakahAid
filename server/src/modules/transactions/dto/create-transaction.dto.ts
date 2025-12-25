import { IsUUID, IsNumber, IsEnum, IsString, IsEmail, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentGateway } from '../../../common/enums/status.enum';

export class CreateTransactionDto {
  @IsUUID()
  campaignId: string;

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
}
