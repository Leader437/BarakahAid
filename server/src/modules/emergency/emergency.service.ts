import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CampaignsService } from '../campaigns/campaigns.service';

@Injectable()
export class EmergencyService {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async checkEmergencyFeeds(): Promise<void> {
    const disasters = await this.simulateDisasterFeed();

    for (const disaster of disasters) {
      await this.createEmergencyCampaignDraft(disaster);
    }
  }

  private async simulateDisasterFeed(): Promise<any[]> {
    const disasters = [
      {
        type: 'Earthquake',
        location: 'Region A',
        severity: 'High',
        description: 'Earthquake detected in Region A requiring immediate assistance',
      },
      {
        type: 'Flood',
        location: 'Region B',
        severity: 'Medium',
        description: 'Flooding reported in Region B, emergency relief needed',
      },
    ];

    return Math.random() > 0.9 ? disasters.slice(0, 1) : [];
  }

  private async createEmergencyCampaignDraft(disaster: any): Promise<void> {
    const adminUserId = '00000000-0000-0000-0000-000000000001';

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    await this.campaignsService.create(adminUserId, {
      title: `Emergency: ${disaster.type} in ${disaster.location}`,
      description: disaster.description,
      goalAmount: 50000,
      startDate,
      endDate,
      isEmergency: true,
    });
  }

  async getEmergencyCampaigns(): Promise<any[]> {
    return this.campaignsService.findAll({ isEmergency: true });
  }
}
