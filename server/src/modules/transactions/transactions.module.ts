import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentModule } from '../payments/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    CampaignsModule,
    NotificationsModule,
    PaymentModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
