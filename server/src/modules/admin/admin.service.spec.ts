import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Campaign } from '../campaigns/entities/campaign.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { DonationRequest } from '../donations/entities/donation-request.entity';
import { TransactionStatus, DonationRequestStatus } from '../../common/enums/status.enum';
import { Role } from '../../common/enums/role.enum';
import { PdfGeneratorUtil } from '../../utils/pdf-generator.util';

jest.mock('../../utils/pdf-generator.util');

describe('AdminService', () => {
  let service: AdminService;
  let userRepository: any;
  let campaignRepository: any;
  let transactionRepository: any;
  let donationRequestRepository: any;

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
    getRawMany: jest.fn(),
  };

  const mockUserRepository = {
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockCampaignRepository = {
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockTransactionRepository = {
    count: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockDonationRequestRepository = {
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Campaign),
          useValue: mockCampaignRepository,
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: getRepositoryToken(DonationRequest),
          useValue: mockDonationRequestRepository,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);

    jest.clearAllMocks();
  });

  describe('getGlobalAnalytics', () => {
    it('should return global analytics', async () => {
      mockUserRepository.count
        .mockResolvedValueOnce(100) // totalUsers
        .mockResolvedValueOnce(50)  // activeDonors
        .mockResolvedValueOnce(10); // activeNGOs
      mockCampaignRepository.count.mockResolvedValue(25);
      mockTransactionRepository.count.mockResolvedValue(500);
      mockDonationRequestRepository.count.mockResolvedValue(5);
      mockQueryBuilder.getRawOne.mockResolvedValue({ total: '50000' });

      const result = await service.getGlobalAnalytics();

      expect(result).toHaveProperty('totalUsers', 100);
      expect(result).toHaveProperty('totalCampaigns', 25);
      expect(result).toHaveProperty('totalDonations', 500);
      expect(result).toHaveProperty('totalAmountRaised', 50000);
    });

    it('should return 0 for totalAmountRaised when no transactions', async () => {
      mockUserRepository.count.mockResolvedValue(0);
      mockCampaignRepository.count.mockResolvedValue(0);
      mockTransactionRepository.count.mockResolvedValue(0);
      mockDonationRequestRepository.count.mockResolvedValue(0);
      mockQueryBuilder.getRawOne.mockResolvedValue({ total: null });

      const result = await service.getGlobalAnalytics();

      expect(result.totalAmountRaised).toBe(0);
    });
  });

  describe('generateGlobalReport', () => {
    it('should generate PDF report', async () => {
      mockUserRepository.count.mockResolvedValue(100);
      mockCampaignRepository.count.mockResolvedValue(25);
      mockTransactionRepository.count.mockResolvedValue(500);
      mockDonationRequestRepository.count.mockResolvedValue(5);
      mockQueryBuilder.getRawOne.mockResolvedValue({ total: '50000' });
      (PdfGeneratorUtil.generateAdminReport as jest.Mock).mockResolvedValue(
        Buffer.from('PDF content'),
      );

      const result = await service.generateGlobalReport('monthly');

      expect(Buffer.isBuffer(result)).toBe(true);
      expect(PdfGeneratorUtil.generateAdminReport).toHaveBeenCalledWith(
        expect.objectContaining({ period: 'monthly' }),
      );
    });
  });

  describe('getUserStatistics', () => {
    it('should return user statistics by role', async () => {
      mockQueryBuilder.getRawMany.mockResolvedValue([
        { role: 'DONOR', count: '50' },
        { role: 'NGO', count: '10' },
        { role: 'ADMIN', count: '5' },
      ]);

      const result = await service.getUserStatistics();

      expect(result).toHaveProperty('DONOR', 50);
      expect(result).toHaveProperty('NGO', 10);
      expect(result).toHaveProperty('ADMIN', 5);
    });
  });

  describe('getCampaignStatistics', () => {
    it('should return campaign statistics by status', async () => {
      mockQueryBuilder.getRawMany.mockResolvedValue([
        { status: 'active', count: '15' },
        { status: 'completed', count: '8' },
        { status: 'draft', count: '2' },
      ]);

      const result = await service.getCampaignStatistics();

      expect(result).toHaveProperty('active', 15);
      expect(result).toHaveProperty('completed', 8);
      expect(result).toHaveProperty('draft', 2);
    });
  });

  describe('getRecentActivity', () => {
    it('should return recent transactions as activity', async () => {
      const mockTransactions = [
        {
          id: 'tx-1',
          donor: { name: 'Test Donor' },
          campaign: { title: 'Test Campaign' },
          amount: 1000,
          createdAt: new Date(),
        },
      ];
      mockTransactionRepository.find.mockResolvedValue(mockTransactions);

      const result = await service.getRecentActivity(10);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('type', 'donation');
      expect(result[0]).toHaveProperty('donor', 'Test Donor');
    });

    it('should use default limit of 10', async () => {
      mockTransactionRepository.find.mockResolvedValue([]);

      await service.getRecentActivity();

      expect(mockTransactionRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ take: 10 }),
      );
    });
  });
});
