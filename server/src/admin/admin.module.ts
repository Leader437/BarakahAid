import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../modules/users/users.module';
import { DonationsModule } from '../modules/donations/donations.module';
import { CampaignsModule } from '../modules/campaigns/campaigns.module';

@Module({
  imports: [
    UsersModule,
    DonationsModule,
    CampaignsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
