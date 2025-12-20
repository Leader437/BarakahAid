import { IsUUID, IsNumber, IsEnum } from 'class-validator';
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
}
