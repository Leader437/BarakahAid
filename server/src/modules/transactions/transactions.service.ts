import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionStatus, NotificationType } from '../../common/enums/status.enum';
import { CampaignsService } from '../campaigns/campaigns.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentService } from '../payments/payment.service';
import { PdfGeneratorUtil } from '../../utils/pdf-generator.util';
import { FileUploadUtil } from '../../utils/file-upload.util';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly campaignsService: CampaignsService,
    private readonly notificationsService: NotificationsService,
    private readonly paymentService: PaymentService,
  ) {}

  async create(userId: string, createDto: CreateTransactionDto): Promise<Transaction> {
    // Validate that either campaignId or requestId is provided
    if (!createDto.campaignId && !createDto.requestId) {
      throw new BadRequestException('Either campaignId or requestId must be provided');
    }

    let campaign: any = null;
    let targetTitle = 'Donation';

    if (createDto.campaignId) {
      campaign = await this.campaignsService.findOne(createDto.campaignId);
      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }
      targetTitle = campaign.title;
    }

    // For requestId, we'll just store it - the campaign relation can be null
    // In a full implementation, you'd have a DonationRequest relation

    const transaction = this.transactionRepository.create({
      ...createDto,
      donor: { id: userId } as any,
      campaign: createDto.campaignId ? { id: createDto.campaignId } as any : null,
      status: TransactionStatus.COMPLETED, // Mark as completed immediately for demo
      isAnonymous: createDto.isAnonymous || false,
      isRecurring: createDto.isRecurring || false,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    // Update campaign raised amount if it's a campaign donation
    if (campaign) {
      await this.campaignsService.updateRaisedAmount(
        campaign.id,
        createDto.amount
      );
    }

    // Send notification about successful donation
    await this.notificationsService.create(
      userId,
      NotificationType.PAYMENT_SUCCESS,
      `Thank you for your donation of $${createDto.amount} to ${targetTitle}!`,
      {
        campaignId: createDto.campaignId,
        requestId: createDto.requestId,
        transactionId: savedTransaction.id,
        amount: createDto.amount,
      },
    );

    return savedTransaction;
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

  async findReceivedByNgo(ngoId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        campaign: {
          createdBy: { id: ngoId },
        },
      },
      relations: ['campaign', 'donor'],
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

  /**
   * Handle webhook event when payment succeeds
   * Called from PaymentController webhook handler
   */
  async handlePaymentSucceeded(paymentIntentId: string, metadata: any) {
    try {
      // Find transaction by payment reference
      const transaction = await this.transactionRepository.findOne({
        where: { paymentReference: paymentIntentId },
        relations: ['donor', 'campaign'],
      });

      if (!transaction) {
        throw new NotFoundException(`Transaction not found for payment ${paymentIntentId}`);
      }

      // Update transaction status to completed
      transaction.status = TransactionStatus.COMPLETED;
      await this.transactionRepository.save(transaction);

      // Update campaign raised amount
      await this.campaignsService.updateRaisedAmount(
        transaction.campaign.id,
        transaction.amount,
      );

      // Generate receipt
      const receiptBuffer = await PdfGeneratorUtil.generateDonationReceipt({
        receiptId: transaction.id,
        date: transaction.createdAt,
        donorName: transaction.donor.name,
        campaignTitle: transaction.campaign.title,
        amount: transaction.amount,
        paymentMethod: transaction.paymentGateway,
      });

      // Send success notification
      await this.notificationsService.create(
        transaction.donor.id,
        NotificationType.PAYMENT_SUCCESS,
        `Payment successful for ${transaction.campaign.title}. Thank you for your donation!`,
        {
          campaignId: transaction.campaign.id,
          transactionId: transaction.id,
          amount: transaction.amount,
        },
      );

      return transaction;
    } catch (error) {
      throw new BadRequestException(`Failed to process payment webhook: ${error.message}`);
    }
  }

  /**
   * Handle webhook event when payment fails
   */
  async handlePaymentFailed(paymentIntentId: string, error: string) {
    try {
      const transaction = await this.transactionRepository.findOne({
        where: { paymentReference: paymentIntentId },
        relations: ['donor', 'campaign'],
      });

      if (!transaction) {
        throw new NotFoundException(`Transaction not found for payment ${paymentIntentId}`);
      }

      transaction.status = TransactionStatus.FAILED;
      await this.transactionRepository.save(transaction);

      // Send failure notification
      await this.notificationsService.create(
        transaction.donor.id,
        NotificationType.PAYMENT_FAILED,
        `Payment failed for ${transaction.campaign.title}. Error: ${error}`,
        {
          campaignId: transaction.campaign.id,
          transactionId: transaction.id,
        },
      );

      return transaction;
    } catch (error) {
      throw new BadRequestException(`Failed to process payment failure: ${error.message}`);
    }
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find({
      relations: ['donor', 'campaign'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: TransactionStatus): Promise<Transaction> {
    const transaction = await this.findOne(id);
    transaction.status = status;
    return this.transactionRepository.save(transaction);
  }

}
