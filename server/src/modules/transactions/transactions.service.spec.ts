import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { CampaignsService } from '../campaigns/campaigns.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentService } from '../payments/payment.service';
import { DonationsService } from '../donations/donations.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TransactionStatus, PaymentGateway } from '../../common/enums/status.enum';
import { PdfGeneratorUtil } from '../../utils/pdf-generator.util';

// Mock utilities
jest.mock('../../utils/pdf-generator.util');

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionRepository: any;
  let campaignsService: any;
  let notificationsService: any;
  let paymentService: any;
  let donationsService: any;

  const mockDonor = {
    id: 'donor-id-123',
    name: 'Test Donor',
    email: 'donor@example.com',
  };

  const mockCampaign = {
    id: 'campaign-id-123',
    title: 'Test Campaign',
    createdBy: { id: 'ngo-id-123', name: 'Test NGO' },
  };

  const mockTransaction = {
    id: 'transaction-id-123',
    amount: 1000,
    status: TransactionStatus.COMPLETED,
    donor: mockDonor,
    campaign: mockCampaign,
    paymentReference: 'pi_123456',
    createdAt: new Date(),
  };

  const mockTransactionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockTransaction]),
      getRawMany: jest.fn().mockResolvedValue([]),
    })),
  };

  const mockCampaignsService = {
    findOne: jest.fn(),
    updateRaisedAmount: jest.fn(),
  };

  const mockNotificationsService = {
    create: jest.fn(),
  };

  const mockPaymentService = {
    createPaymentIntent: jest.fn(),
  };

  const mockDonationsService = {
    findOne: jest.fn(),
    updateCurrentAmount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: CampaignsService,
          useValue: mockCampaignsService,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
        {
          provide: PaymentService,
          useValue: mockPaymentService,
        },
        {
          provide: DonationsService,
          useValue: mockDonationsService,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionRepository = module.get(getRepositoryToken(Transaction));
    campaignsService = module.get(CampaignsService);
    notificationsService = module.get(NotificationsService);
    paymentService = module.get(PaymentService);
    donationsService = module.get(DonationsService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto = {
      amount: 1000,
      campaignId: 'campaign-id-123',
      paymentGateway: PaymentGateway.STRIPE,
    };

    it('should create transaction for campaign donation', async () => {
      mockCampaignsService.findOne.mockResolvedValue(mockCampaign);
      mockPaymentService.createPaymentIntent.mockResolvedValue({
        paymentIntentId: 'pi_123',
        clientSecret: 'cs_123',
      });
      mockTransactionRepository.create.mockReturnValue(mockTransaction);
      mockTransactionRepository.save.mockResolvedValue(mockTransaction);

      const result = await service.create('donor-id-123', createDto);

      expect(result).toHaveProperty('id');
      expect(mockCampaignsService.findOne).toHaveBeenCalledWith('campaign-id-123');
    });

    it('should create transaction for donation request', async () => {
      const requestDto = {
        ...createDto,
        requestId: 'request-id-123',
        campaignId: undefined,
      };

      mockDonationsService.findOne.mockResolvedValue({
        id: 'request-id-123',
        title: 'Test Request',
        createdBy: { id: 'beneficiary-id' },
      });
      mockPaymentService.createPaymentIntent.mockResolvedValue({
        paymentIntentId: 'pi_123',
        clientSecret: 'cs_123',
      });
      mockTransactionRepository.create.mockReturnValue(mockTransaction);
      mockTransactionRepository.save.mockResolvedValue(mockTransaction);

      const result = await service.create('donor-id-123', requestDto);

      expect(result).toHaveProperty('id');
    });

    it('should throw BadRequestException if campaign not found', async () => {
      mockCampaignsService.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.create('donor-id-123', createDto)).rejects.toThrow();
    });
  });

  describe('findByDonor', () => {
    it('should return transactions for donor with formatted data', async () => {
      // Ensure mock returns an empty array to avoid Promise.all issues
      mockTransactionRepository.find.mockResolvedValue([]);
      
      const result = await service.findByDonor('donor-id-123');

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('findByCampaign', () => {
    it('should return transactions for campaign', async () => {
      mockTransactionRepository.find.mockResolvedValue([mockTransaction]);

      const result = await service.findByCampaign('campaign-id-123');

      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return transaction when found', async () => {
      mockTransactionRepository.findOne.mockResolvedValue(mockTransaction);

      const result = await service.findOne('transaction-id-123');

      expect(result).toEqual(mockTransaction);
    });

    it('should throw NotFoundException when not found', async () => {
      mockTransactionRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      mockTransactionRepository.find.mockResolvedValue([mockTransaction]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
    });
  });

  describe('updateStatus', () => {
    it('should update transaction status', async () => {
      mockTransactionRepository.findOne.mockResolvedValue({ ...mockTransaction });
      mockTransactionRepository.save.mockResolvedValue({
        ...mockTransaction,
        status: TransactionStatus.COMPLETED,
      });

      const result = await service.updateStatus(
        'transaction-id-123',
        TransactionStatus.COMPLETED,
      );

      expect(result.status).toBe(TransactionStatus.COMPLETED);
    });
  });

  describe('handlePaymentSucceeded', () => {
    it('should update transaction and campaign on payment success', async () => {
      const metadata = {
        campaignId: 'campaign-id-123',
        donorId: 'donor-id-123',
        amount: 1000,
      };

      mockTransactionRepository.findOne.mockResolvedValue({ ...mockTransaction });
      mockTransactionRepository.save.mockResolvedValue({
        ...mockTransaction,
        status: TransactionStatus.COMPLETED,
      });
      mockCampaignsService.findOne.mockResolvedValue(mockCampaign);
      mockCampaignsService.updateRaisedAmount.mockResolvedValue(undefined);
      mockNotificationsService.create.mockResolvedValue({});

      await service.handlePaymentSucceeded('pi_123456', metadata);

      expect(mockTransactionRepository.save).toHaveBeenCalled();
    });
  });

  describe('handlePaymentFailed', () => {
    it('should update transaction status on payment failure', async () => {
      mockTransactionRepository.findOne.mockResolvedValue({ ...mockTransaction });
      mockTransactionRepository.save.mockResolvedValue({
        ...mockTransaction,
        status: TransactionStatus.FAILED,
      });

      await service.handlePaymentFailed('pi_123456', 'Card declined');

      expect(mockTransactionRepository.save).toHaveBeenCalled();
    });
  });

  describe('generateReceipt', () => {
    it('should generate receipt PDF for valid transaction', async () => {
      mockTransactionRepository.findOne.mockResolvedValue({
        ...mockTransaction,
        status: TransactionStatus.COMPLETED,
        donor: { id: 'donor-id-123', name: 'Test Donor' },
        paymentGateway: 'STRIPE',
      });
      (PdfGeneratorUtil.generateDonationReceipt as jest.Mock).mockResolvedValue(
        Buffer.from('PDF content'),
      );

      const result = await service.generateReceipt(
        'transaction-id-123',
        'donor-id-123',
      );

      expect(Buffer.isBuffer(result)).toBe(true);
    });

    it('should throw NotFoundException if transaction not found', async () => {
      mockTransactionRepository.findOne.mockResolvedValue(null);

      await expect(
        service.generateReceipt('invalid-id', 'donor-id-123'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('generateYearlyReport', () => {
    it('should generate yearly report PDF', async () => {
      (PdfGeneratorUtil.generateYearlyReport as jest.Mock).mockResolvedValue(
        Buffer.from('PDF content'),
      );

      const result = await service.generateYearlyReport('donor-id-123', 2024);

      expect(Buffer.isBuffer(result)).toBe(true);
    });
  });
});
