import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Campaign } from '../campaigns/entities/campaign.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Role } from '../../common/enums/role.enum';
import { TransactionStatus, DonationRequestStatus } from '../../common/enums/status.enum';
import { PdfGeneratorUtil } from '../../utils/pdf-generator.util';
import { DonationRequest } from '../donations/entities/donation-request.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(DonationRequest)
    private readonly donationRequestRepository: Repository<DonationRequest>,
  ) {}

  async getGlobalAnalytics(): Promise<any> {
    const [
      totalUsers,
      totalCampaigns,
      totalDonations,
      activeDonors,
      activeNGOs,
      pendingRequests,
    ] = await Promise.all([
      this.userRepository.count(),
      this.campaignRepository.count(),
      this.transactionRepository.count({
        where: { status: TransactionStatus.COMPLETED },
      }),
      this.userRepository.count({ where: { role: Role.DONOR } }),
      this.userRepository.count({ where: { role: Role.NGO } }),
      this.donationRequestRepository.count({
        where: { status: DonationRequestStatus.PENDING },
      }),
    ]);

    const totalAmountResult = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'total')
      .where('transaction.status = :status', { status: TransactionStatus.COMPLETED })
      .getRawOne();

    const totalAmount = totalAmountResult?.total || 0;

    return {
      totalUsers,
      totalCampaigns,
      totalDonations,
      totalAmountRaised: parseFloat(totalAmount as any) || 0,
      activeDonors,
      activeNGOs,
      pendingRequests,
    };
  }

  async generateGlobalReport(period: string): Promise<Buffer> {
    const analytics = await this.getGlobalAnalytics();

    return PdfGeneratorUtil.generateAdminReport({
      period,
      totalCampaigns: analytics.totalCampaigns,
      totalDonations: analytics.totalDonations,
      totalAmount: analytics.totalAmountRaised,
      activeNGOs: analytics.activeNGOs,
      activeDonors: analytics.activeDonors,
      volunteerHours: 0,
    });
  }

  async getUserStatistics(): Promise<any> {
    const usersByRole = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    return usersByRole.reduce((acc, item) => {
      acc[item.role] = parseInt(item.count);
      return acc;
    }, {});
  }

  async getCampaignStatistics(): Promise<any> {
    const campaignsByStatus = await this.campaignRepository
      .createQueryBuilder('campaign')
      .select('campaign.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('campaign.status')
      .getRawMany();

    return campaignsByStatus.reduce((acc, item) => {
      acc[item.status] = parseInt(item.count);
      return acc;
    }, {});
  }

  async getRecentActivity(limit: number = 10): Promise<any> {
    const recentTransactions = await this.transactionRepository.find({
      relations: ['donor', 'campaign'],
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return recentTransactions.map((t) => ({
      id: t.id,
      type: 'donation',
      donor: t.donor.name,
      campaign: t.campaign.title,
      amount: t.amount,
      date: t.createdAt,
    }));
  }
}
