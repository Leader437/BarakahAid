import { Controller, Get, UseGuards } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('emergency')
export class EmergencyController {
  constructor(private readonly emergencyService: EmergencyService) {}

  @Get('campaigns')
  async getEmergencyCampaigns() {
    return this.emergencyService.getEmergencyCampaigns();
  }

  @Get('trigger-check')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async triggerCheck() {
    await this.emergencyService.checkEmergencyFeeds();
    return { message: 'Emergency feed check triggered' };
  }
}
