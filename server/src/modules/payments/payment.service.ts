import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

export interface PaymentIntentData {
  amount: number; // Amount in cents (e.g., 10000 = $100.00 or PKR 100)
  currency: string;
  campaignId: string;
  donorId: string;
  donorEmail: string;
  donorName: string;
}

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  private readonly logger = new Logger(PaymentService.name);

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    
    if (!secretKey) {
      this.logger.warn('⚠️ STRIPE_SECRET_KEY not configured - using demo mode');
      // Demo mode - using test key
      this.stripe = new Stripe('sk_test_51234567890abcdefghijklmnopqrstuvwxyz');
    } else {
      this.stripe = new Stripe(secretKey);
    }
  }

  /**
   * Create a payment intent for donation
   * Demo mode uses Stripe test cards that don't require real payment
   */
  async createPaymentIntent(data: PaymentIntentData) {
    try {
      this.logger.log(`Creating payment intent for campaign ${data.campaignId} by donor ${data.donorId}`);

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: data.amount,
        currency: data.currency.toLowerCase(),
        description: `Donation via BarakahAid`,
        metadata: {
          campaignId: data.campaignId,
          donorId: data.donorId,
          donorEmail: data.donorEmail,
          donorName: data.donorName,
          platform: 'BarakahAid-Demo',
        },
        receipt_email: data.donorEmail,
        statement_descriptor: 'BarakahAid Donation',
      });

      this.logger.log(`✅ Payment intent created: ${paymentIntent.id}`);

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        // Demo info for testing
        demo: {
          testCards: {
            success: '4242 4242 4242 4242',
            declined: '4000 0000 0000 0002',
            requiresAuth: '4000 0025 0000 3155',
          },
          expiryDate: 'Any future date',
          cvc: 'Any 3 digits',
        },
      };
    } catch (error) {
      this.logger.error(`❌ Error creating payment intent: ${error.message}`);
      throw new BadRequestException(
        `Payment error: ${error.message}`,
      );
    }
  }

  /**
   * Retrieve payment intent details
   */
  async getPaymentIntent(paymentIntentId: string) {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      this.logger.error(`Error retrieving payment intent: ${error.message}`);
      throw new BadRequestException('Payment intent not found');
    }
  }

  /**
   * Confirm payment intent (usually done on frontend with Stripe.js)
   * This is for server-side confirmation if needed
   */
  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string) {
    try {
      return await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });
    } catch (error) {
      this.logger.error(`Error confirming payment: ${error.message}`);
      throw new BadRequestException(`Payment confirmation failed: ${error.message}`);
    }
  }

  /**
   * Create a refund for a payment
   */
  async refundPayment(paymentIntentId: string, amount?: number) {
    try {
      return await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount,
      });
    } catch (error) {
      this.logger.error(`Error refunding payment: ${error.message}`);
      throw new BadRequestException(`Refund failed: ${error.message}`);
    }
  }

  /**
   * Retrieve refund status
   */
  async getRefundStatus(refundId: string) {
    try {
      return await this.stripe.refunds.retrieve(refundId);
    } catch (error) {
      this.logger.error(`Error retrieving refund: ${error.message}`);
      throw new BadRequestException('Refund not found');
    }
  }

  /**
   * Webhook handler for Stripe events
   * Validates and processes Stripe webhook events
   */
  async processWebhookEvent(event: Stripe.Event) {
    this.logger.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'payment_intent.succeeded':
        return this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
      case 'payment_intent.payment_failed':
        return this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
      case 'payment_intent.canceled':
        return this.handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent);
      default:
        this.logger.warn(`Unhandled webhook event type: ${event.type}`);
        return null;
    }
  }

  private handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    this.logger.log(`✅ Payment succeeded: ${paymentIntent.id}`);
    this.logger.log(`Campaign: ${paymentIntent.metadata?.campaignId}`);
    this.logger.log(`Donor: ${paymentIntent.metadata?.donorEmail}`);
    this.logger.log(`Amount: ${paymentIntent.amount} ${paymentIntent.currency}`);
    // Here you would update your database with the successful transaction
    return {
      event: 'payment_succeeded',
      paymentIntentId: paymentIntent.id,
      metadata: paymentIntent.metadata,
    };
  }

  private handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    this.logger.warn(`❌ Payment failed: ${paymentIntent.id}`);
    this.logger.warn(`Reason: ${paymentIntent.last_payment_error?.message}`);
    // Here you would update your database with the failed transaction
    return {
      event: 'payment_failed',
      paymentIntentId: paymentIntent.id,
      error: paymentIntent.last_payment_error?.message,
    };
  }

  private handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
    this.logger.warn(`⚠️ Payment canceled: ${paymentIntent.id}`);
    return {
      event: 'payment_canceled',
      paymentIntentId: paymentIntent.id,
    };
  }

  /**
   * Verify webhook signature
   * Used to ensure webhook came from Stripe
   */
  verifyWebhookSignature(body: Buffer, signature: string): Stripe.Event {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_1234567890abcdefghijklmnopqrstuvwxyz';
    
    try {
      return this.stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      this.logger.error(`Webhook signature verification failed: ${error.message}`);
      throw new BadRequestException('Invalid webhook signature');
    }
  }
}
