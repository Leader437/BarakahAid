import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CampaignsService } from '../campaigns/campaigns.service';
import { DisasterFeedUtil, DisasterAlert } from './utils/disaster-feed.util';
import { UsersService } from '../users/users.service';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class EmergencyService {
  private readonly logger = new Logger(EmergencyService.name);
  private processedAlerts = new Set<string>(); // Track processed alerts to avoid duplicates

  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly disasterFeedUtil: DisasterFeedUtil,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Check disaster feeds every hour
   * Fetches real data from USGS, PMD, GDACS, and NDMA sources
   */
  @Cron(CronExpression.EVERY_HOUR)
  async checkEmergencyFeeds(): Promise<void> {
    try {
      this.logger.log('🔍 Checking real-time disaster feeds...');

      const disasters = await this.disasterFeedUtil.getAllDisasterAlerts();

      if (disasters.length === 0) {
        this.logger.log('✅ No critical disasters detected');
        return;
      }

      this.logger.warn(`⚠️ CRITICAL: ${disasters.length} disaster alerts detected!`);

      // Process only new, critical, and high-severity alerts
      const criticalAlerts = disasters.filter(d => 
        d.severity === 'CRITICAL' || d.severity === 'HIGH'
      );

      for (const disaster of criticalAlerts) {
        await this.createEmergencyCampaignDraft(disaster);
      }
    } catch (error) {
      this.logger.error(`❌ Error checking emergency feeds: ${error.message}`);
    }
  }

  /**
   * Create emergency campaign draft from disaster alert
   * Requires admin approval before going live
   */
  private async createEmergencyCampaignDraft(disaster: DisasterAlert): Promise<void> {
    try {
      const alertKey = `${disaster.type}-${disaster.location}-${disaster.timestamp.getTime()}`;
      
      // Skip if already processed
      if (this.processedAlerts.has(alertKey)) {
        this.logger.log(`⏭️ Alert already processed: ${alertKey}`);
        return;
      }

      // Mark as processed
      this.processedAlerts.add(alertKey);

      // Find a valid admin or NGO user to create the campaign
      let creatorUser = await this.usersService.findByRole(Role.ADMIN);
      if (!creatorUser) {
        creatorUser = await this.usersService.findByRole(Role.NGO);
      }
      
      if (!creatorUser) {
        this.logger.error('❌ No admin or NGO user found to create emergency campaign');
        this.processedAlerts.delete(alertKey); // Allow retry
        return;
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      // Calculate goal amount based on severity
      const goalAmount = this.calculateGoalAmount(disaster);

      const campaignData = {
        title: `🚨 EMERGENCY: ${disaster.type} in ${disaster.location}`,
        description: `
**URGENT DISASTER ALERT**

**Type:** ${disaster.type}
**Location:** ${disaster.location}
**Severity:** ${disaster.severity}
**Detected:** ${disaster.timestamp.toISOString()}
**Source:** ${disaster.source}

**Details:**
${disaster.description}

${disaster.magnitude ? `**Magnitude:** ${disaster.magnitude}` : ''}
${disaster.estimatedDamage ? `**Estimated Damage:** ${disaster.estimatedDamage}` : ''}

**HELP NEEDED:** We are launching an emergency relief campaign to provide immediate assistance to affected communities. Your donation will directly support rescue operations, emergency shelter, medical aid, and food distribution.

**This campaign is PENDING ADMIN REVIEW** - It will go live once verified by our emergency response team.
        `,
        goalAmount,
        startDate,
        endDate,
        isEmergency: true,
        category: this.mapDisasterToCategory(disaster.type),
      };

      // Create campaign in draft status (status: 'draft')
      const campaign = await this.campaignsService.create(creatorUser.id, campaignData);

      this.logger.warn(`✅ Emergency campaign DRAFT created: ${campaign.id}`);
      this.logger.warn(`⚠️ Admin review required before going live!`);
      this.logger.log(`Campaign Details: ${JSON.stringify(campaign, null, 2)}`);

    } catch (error) {
      this.logger.error(`❌ Error creating emergency campaign: ${error.message}`);
    }
  }

  /**
   * Get all emergency campaigns (active + pending admin review)
   */
  async getEmergencyCampaigns(): Promise<any[]> {
    try {
      return await this.campaignsService.findAll({ isEmergency: true });
    } catch (error) {
      this.logger.error(`Error fetching emergency campaigns: ${error.message}`);
      return [];
    }
  }

  /**
   * Get real-time disaster alerts (last 24 hours)
   * @param includeDemoData - Include demo alerts for visualization/testing
   */
  async getCurrentDisasterAlerts(includeDemoData: boolean = false): Promise<DisasterAlert[]> {
    try {
      this.logger.log(`🔍 Fetching alerts with demo mode: ${includeDemoData}`);
      const alerts = await this.disasterFeedUtil.getAllDisasterAlerts(includeDemoData);
      
      // Filter for last 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const filtered = alerts.filter(a => a.timestamp >= oneDayAgo);
      this.logger.log(`✅ Returning ${filtered.length} alerts (${includeDemoData ? 'with demo' : 'without demo'})`);
      return filtered;
    } catch (error) {
      this.logger.error(`Error fetching disaster alerts: ${error.message}`);
      return [];
    }
  }

  /**
   * Helper: Calculate funding goal based on disaster type and severity
   */
  private calculateGoalAmount(disaster: DisasterAlert): number {
    const baseAmount = {
      'EARTHQUAKE': 500000,
      'FLOOD': 300000,
      'CYCLONE': 400000,
      'TSUNAMI': 600000,
      'LANDSLIDE': 200000,
      'HEATWAVE': 150000,
      'DROUGHT': 200000,
    };

    const typeAmount = baseAmount[disaster.type] || 300000;
    const severityMultiplier = {
      'CRITICAL': 2.0,
      'HIGH': 1.5,
      'MEDIUM': 1.0,
      'LOW': 0.5,
    };

    const multiplier = severityMultiplier[disaster.severity] || 1.0;
    return Math.round(typeAmount * multiplier);
  }

  /**
   * Helper: Map disaster type to donation category
   */
  private mapDisasterToCategory(disasterType: string): string {
    const categoryMap = {
      'EARTHQUAKE': 'Emergency Relief',
      'FLOOD': 'Emergency Relief',
      'CYCLONE': 'Emergency Relief',
      'TSUNAMI': 'Emergency Relief',
      'LANDSLIDE': 'Emergency Relief',
      'HEATWAVE': 'Medical Aid',
      'DROUGHT': 'Food & Water',
    };

    return categoryMap[disasterType as keyof typeof categoryMap] || 'Emergency Relief';
  }
}
