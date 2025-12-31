import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Campaign } from '../campaigns/entities/campaign.entity';
import { User } from '../users/entities/user.entity';
import { DonationRequest } from '../donations/entities/donation-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Campaign, Transaction, DonationRequest]),
    UsersModule,
    CampaignsModule,
    TransactionsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
