import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @Roles(Role.ADMIN)
  async findAll() {
    return this.transactionsService.findAll();
  }

  @Post()
  @Roles(Role.DONOR, Role.VOLUNTEER)
  async create(
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(userId, createDto);
  }

  @Get('my-donations')
  @Roles(Role.DONOR)
  async getMyDonations(@CurrentUser('id') userId: string) {
    return this.transactionsService.findByDonor(userId);
  }

  @Get('campaign/:id')
  @Roles(Role.NGO, Role.ADMIN)
  async getCampaignDonations(@Param('id') campaignId: string) {
    return this.transactionsService.findByCampaign(campaignId);
  }

  @Get('received')
  @Roles(Role.NGO)
  async getReceivedDonations(@CurrentUser('id') userId: string) {
    return this.transactionsService.findReceivedByNgo(userId);
  }

  @Get('reports/yearly')
  @Roles(Role.DONOR)
  async getYearlyReport(
    @CurrentUser('id') userId: string,
    @Query('year') year: number,
    @Res() response: Response,
  ) {
    try {
      console.log(`Generating yearly report for user ${userId}, year ${year}`);
      const pdfBuffer = await this.transactionsService.generateYearlyReport(
        userId,
        year,
      );

      response.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename=donation-report-${year}.pdf`,
        'Content-Length': pdfBuffer.length,
      });

      response.end(pdfBuffer);
    } catch (error) {
      console.error('Failed to generate yearly report:', error);
      response.status(500).json({ message: 'Failed to generate report', error: error.message });
    }
  }

  @Get(':id/receipt')
  @Roles(Role.DONOR)
  async getReceipt(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    const pdfBuffer = await this.transactionsService.generateReceipt(id, userId);

    response.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=receipt-${id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    response.end(pdfBuffer);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Put(':id/status')
  @Roles(Role.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: any,
  ) {
    return this.transactionsService.updateStatus(id, status);
  }
}
