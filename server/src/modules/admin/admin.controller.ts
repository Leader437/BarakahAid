import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('analytics')
  async getGlobalAnalytics() {
    return this.adminService.getGlobalAnalytics();
  }

  @Get('analytics/users')
  async getUserStatistics() {
    return this.adminService.getUserStatistics();
  }

  @Get('analytics/campaigns')
  async getCampaignStatistics() {
    return this.adminService.getCampaignStatistics();
  }

  @Get('analytics/activity')
  async getRecentActivity(@Query('limit') limit?: number) {
    return this.adminService.getRecentActivity(limit);
  }

  @Get('reports/global')
  async generateGlobalReport(
    @Query('period') period: string,
    @Res() response: Response,
  ) {
    const pdfBuffer = await this.adminService.generateGlobalReport(period);

    response.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=global-report-${period}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    response.end(pdfBuffer);
  }
}
