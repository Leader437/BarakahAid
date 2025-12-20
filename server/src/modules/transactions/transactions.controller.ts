import {
  Controller,
  Get,
  Post,
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

  @Post()
  @Roles(Role.DONOR)
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Get('reports/yearly')
  @Roles(Role.DONOR)
  async getYearlyReport(
    @CurrentUser('id') userId: string,
    @Query('year') year: number,
    @Res() response: Response,
  ) {
    const pdfBuffer = await this.transactionsService.generateYearlyReport(
      userId,
      year,
    );

    response.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=donation-report-${year}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    response.end(pdfBuffer);
  }
}
