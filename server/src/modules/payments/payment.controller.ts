import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  RawBody,
  UseGuards,
  BadRequestException,
  Logger,
  Inject,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

export class CreatePaymentIntentDto {
  amount: number;
  currency: string;
  campaignId: string;
  donorEmail: string;
  donorName: string;
}

export class RefundPaymentDto {
  paymentIntentId: string;
  amount?: number;
  reason?: string;
}

@Controller('payments')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  /**
   * Create a payment intent for a donation
   * POST /payments/intent
   */
  @Post('intent')
  @UseGuards(JwtAuthGuard)
  async createPaymentIntent(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePaymentIntentDto,
  ) {
    this.logger.log(`Creating payment intent for user ${userId}`);

    if (!dto.amount || dto.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    if (!dto.campaignId) {
      throw new BadRequestException('Campaign ID is required');
    }

    return await this.paymentService.createPaymentIntent({
      amount: dto.amount,
      currency: dto.currency || 'usd',
      campaignId: dto.campaignId,
      donorId: userId,
      donorEmail: dto.donorEmail,
      donorName: dto.donorName,
    });
  }

  /**
   * Get payment intent status
   * GET /payments/:paymentIntentId
   */
  @Get(':paymentIntentId')
  async getPaymentIntent(@Param('paymentIntentId') paymentIntentId: string) {
    this.logger.log(`Fetching payment intent: ${paymentIntentId}`);
    const paymentIntent = await this.paymentService.getPaymentIntent(paymentIntentId);

    return {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      created: paymentIntent.created,
      metadata: paymentIntent.metadata,
    };
  }

  /**
   * Process refund
   * POST /payments/refund
   */
  @Post('refund')
  @UseGuards(JwtAuthGuard)
  async refundPayment(
    @CurrentUser('id') userId: string,
    @Body() dto: RefundPaymentDto,
  ) {
    this.logger.log(`Processing refund for payment intent ${dto.paymentIntentId}`);

    const refund = await this.paymentService.refundPayment(
      dto.paymentIntentId,
      dto.amount,
    );

    return {
      id: refund.id,
      status: refund.status,
      amount: refund.amount,
      reason: refund.reason,
      created: refund.created,
    };
  }

  /**
   * Get refund status
   * GET /payments/refund/:refundId
   */
  @Get('refund/:refundId')
  async getRefundStatus(@Param('refundId') refundId: string) {
    this.logger.log(`Fetching refund status: ${refundId}`);
    return await this.paymentService.getRefundStatus(refundId);
  }

  /**
   * Webhook endpoint for Stripe events
   * POST /payments/webhook
   * This endpoint receives events from Stripe (no authentication needed)
   */
  @Post('webhook')
  async handleWebhook(
    @RawBody() body: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    try {
      const event = this.paymentService.verifyWebhookSignature(body, signature);
      this.logger.log(`✅ Valid webhook received: ${event.type}`);

      const result = await this.paymentService.processWebhookEvent(event);

      return {
        success: true,
        event: event.type,
        data: result,
      };
    } catch (error) {
      this.logger.error(`Webhook error: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Health check for payment service
   * GET /payments/health
   */
  @Get('health/check')
  async healthCheck() {
    return {
      status: 'ok',
      service: 'Payment Service',
      mode: 'TEST_MODE',
      message: '✅ Payment service is running in TEST/DEMO mode',
      testCards: {
        success: '4242 4242 4242 4242 - Payment will succeed',
        declined: '4000 0000 0000 0002 - Payment will be declined',
        requiresAuth: '4000 0025 0000 3155 - Requires 3D Secure authentication',
      },
      notes: [
        'This is using Stripe TEST mode - no real charges will occur',
        'Use the test card numbers provided above',
        'Any future expiry date',
        'Any 3-digit CVC',
        'This demo is for testing purposes only',
      ],
    };
  }
}
