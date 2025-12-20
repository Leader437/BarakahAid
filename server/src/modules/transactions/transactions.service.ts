import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionStatus } from '../../common/enums/status.enum';
import { CampaignsService } from '../campaigns/campaigns.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PdfGeneratorUtil } from '../../utils/pdf-generator.util';
import { FileUploadUtil } from '../../utils/file-upload.util';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly campaignsService: CampaignsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(userId: string, createDto: CreateTransactionDto): Promise<Transaction> {
    const campaign = await this.campaignsService.findOne(createDto.campaignId);

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    const transaction = this.transactionRepository.create({
      ...createDto,
      donor: { id: userId } as any,
      campaign: { id: createDto.campaignId } as any,
      status: TransactionStatus.PENDING,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    const paymentResult = await this.processPayment(savedTransaction);

    if (paymentResult.success) {
      savedTransaction.status = TransactionStatus.COMPLETED;
      savedTransaction.paymentReference = paymentResult.reference || '';

      const receiptBuffer = await PdfGeneratorUtil.generateDonationReceipt({
        receiptId: savedTransaction.id,
        date: savedTransaction.createdAt,
        donorName: 'Donor',
        campaignTitle: campaign.title,
        amount: savedTransaction.amount,
        paymentMethod: savedTransaction.paymentGateway,
      });

      await this.campaignsService.updateRaisedAmount(
        createDto.campaignId,
        createDto.amount,
      );

      await this.notificationsService.createDonationNotification(
        userId,
        campaign,
        savedTransaction.amount,
      );
    } else {
      savedTransaction.status = TransactionStatus.FAILED;
    }

    return this.transactionRepository.save(savedTransaction);
  }

  private async processPayment(transaction: Transaction): Promise<{
    success: boolean;
    reference?: string;
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: Math.random() > 0.1,
          reference: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        });
      }, 2000);
    });
  }

  async findByDonor(donorId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { donor: { id: donorId } },
      relations: ['campaign'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCampaign(campaignId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { campaign: { id: campaignId } },
      relations: ['donor'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['donor', 'campaign'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async generateYearlyReport(userId: string, year: number): Promise<Buffer> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const transactions = await this.transactionRepository.find({
      where: {
        donor: { id: userId },
        status: TransactionStatus.COMPLETED,
        createdAt: Between(startDate, endDate),
      },
      relations: ['campaign'],
      order: { createdAt: 'ASC' },
    });

    const totalAmount = transactions.reduce(
      (sum, t) => sum + Number(t.amount),
      0,
    );

    return PdfGeneratorUtil.generateYearlyReport({
      year,
      donorName: 'Donor',
      totalDonations: transactions.length,
      totalAmount,
      donations: transactions.map((t) => ({
        campaignTitle: t.campaign.title,
        amount: t.amount,
        date: t.createdAt,
      })),
    });
  }
}
