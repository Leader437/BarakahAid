import { Injectable } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { DonationsService } from '../modules/donations/donations.service';
import { CampaignsService } from '../modules/campaigns/campaigns.service';

@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private donationsService: DonationsService,
    private campaignsService: CampaignsService,
  ) {}

  async getOverview() {
    const [users, donations, campaigns] = await Promise.all([
      this.usersService.findAll().then(list => list.length),
      this.donationsService.findAll({}).then(list => list.length),
      this.campaignsService.findAll({}).then(list => list.length),
    ]);
    return { users, donations, campaigns };
  }

  getUsers() {
    return this.usersService.findAll();
  }

  updateUserStatus(id: string, dto: any) {
    return this.usersService.updateVerificationStatus(id, dto.status);
  }

  getDonations() {
    return this.donationsService.findAll({});
  }

  getRequests() {
    // integrate with RequestsService when available
    return this.donationsService.findAll({});
  }

  getCampaigns() {
    return this.campaignsService.findAll({});
  }

  getReports() {
    // aggregation placeholder
    return this.getOverview();
  }
}
