import { Module } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { EmergencyController } from './emergency.controller';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { DisasterFeedUtil } from './utils/disaster-feed.util';

@Module({
  imports: [CampaignsModule],
  controllers: [EmergencyController],
  providers: [EmergencyService, DisasterFeedUtil],
  exports: [EmergencyService, DisasterFeedUtil],
})
export class EmergencyModule {}
