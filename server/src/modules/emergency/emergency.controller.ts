import { Controller, Get, UseGuards, Logger, Query } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('emergency')
export class EmergencyController {
  private readonly logger = new Logger(EmergencyController.name);

  constructor(private readonly emergencyService: EmergencyService) {}

  /**
   * Get all active emergency campaigns
   * Public endpoint - accessible to all
   */
  @Get('campaigns')
  async getEmergencyCampaigns() {
    this.logger.log('Fetching active emergency campaigns');
    return await this.emergencyService.getEmergencyCampaigns();
  }

  /**
   * Get current real-time disaster alerts
   * Public endpoint - shows live disaster data for last 24 hours
   * Query param: ?demo=true - includes demo alerts for visualization/testing
   */
  @Get('alerts')
  async getCurrentDisasterAlerts(@Query('demo') demo?: string) {
    const includeDemoData = demo === 'true';
    this.logger.log(`Fetching current disaster alerts${includeDemoData ? ' (with demo data)' : ''}`);
    return {
      timestamp: new Date(),
      alerts: await this.emergencyService.getCurrentDisasterAlerts(includeDemoData),
      sources: [
        'USGS Earthquake Hazards Program',
        'Pakistan Meteorological Department (PMD)',
        'Global Disaster Alert and Coordination System (GDACS)',
      ],
      demoMode: includeDemoData,
    };
  }

  /**
   * Manually trigger emergency feed check
   * Admin only - used for testing or forcing an immediate check
   */
  @Get('trigger-check')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async triggerCheck() {
    this.logger.warn('🔍 Admin triggered manual emergency feed check');
    await this.emergencyService.checkEmergencyFeeds();
    return {
      message: '✅ Emergency feed check completed',
      timestamp: new Date(),
      nextAutomaticCheck: this.getNextCronTime(),
    };
  }

  /**
   * Health check for emergency module
   */
  @Get('health')
  async healthCheck() {
    return {
      status: 'operational',
      module: 'Emergency Response System',
      features: [
        '✅ Real-time earthquake monitoring (USGS)',
        '✅ Weather and flood alerts (PMD)',
        '✅ Global disaster alerts (GDACS)',
        '✅ Automatic campaign generation',
        '⏳ Admin review required before live',
      ],
      automatedCheckInterval: 'Every 1 hour',
      sources: [
        'USGS Earthquake API',
        'PMD RSS Feed',
        'GDACS RSS Feed',
        'NDMA Public Notices',
      ],
    };
  }

  /**
   * Helper: Calculate next cron execution time
   */
  private getNextCronTime(): string {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(nextHour.getHours() + 1);
    nextHour.setMinutes(0, 0, 0);
    return nextHour.toISOString();
  }
}

