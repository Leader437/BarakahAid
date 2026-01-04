import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

describe('PaymentService', () => {
  let service: PaymentService;
  let configService: any;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    configService = module.get(ConfigService);

    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with demo mode when no secret key', () => {
      mockConfigService.get.mockReturnValue(null);
      
      // Service should be created without throwing
      expect(service).toBeDefined();
    });
  });

  describe('createPaymentIntent', () => {
    const paymentData = {
      amount: 10000, // 100.00 in cents
      currency: 'pkr',
      campaignId: 'campaign-123',
      donorId: 'donor-123',
      donorEmail: 'donor@example.com',
      donorName: 'Test Donor',
    };

    it('should return demo response in demo mode', async () => {
      mockConfigService.get.mockReturnValue(null);

      const result = await service.createPaymentIntent(paymentData);

      expect(result).toHaveProperty('clientSecret');
      expect(result).toHaveProperty('paymentIntentId');
      expect(result).toHaveProperty('demo');
      expect(result.status).toBe('succeeded');
    });

    it('should include test card information in demo response', async () => {
      mockConfigService.get.mockReturnValue(null);

      const result = await service.createPaymentIntent(paymentData);

      expect(result.demo.testCards).toHaveProperty('success');
      expect(result.demo.testCards).toHaveProperty('declined');
      expect(result.demo.testCards.success).toBe('4242 4242 4242 4242');
    });
  });

  describe('processWebhookEvent', () => {
    it('should handle payment_intent.succeeded event', async () => {
      const event = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_123',
            amount: 10000,
            currency: 'pkr',
            metadata: {
              campaignId: 'campaign-123',
              donorEmail: 'donor@example.com',
            },
          },
        },
      };

      const result = await service.processWebhookEvent(event as any);

      expect(result).toHaveProperty('event', 'payment_succeeded');
      expect(result).toHaveProperty('paymentIntentId', 'pi_123');
    });

    it('should handle payment_intent.payment_failed event', async () => {
      const event = {
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            id: 'pi_123',
            last_payment_error: {
              message: 'Card declined',
            },
          },
        },
      };

      const result = await service.processWebhookEvent(event as any);

      expect(result).toHaveProperty('event', 'payment_failed');
      expect(result).toHaveProperty('error', 'Card declined');
    });

    it('should handle payment_intent.canceled event', async () => {
      const event = {
        type: 'payment_intent.canceled',
        data: {
          object: {
            id: 'pi_123',
          },
        },
      };

      const result = await service.processWebhookEvent(event as any);

      expect(result).toHaveProperty('event', 'payment_canceled');
    });

    it('should return null for unhandled events', async () => {
      const event = {
        type: 'unknown.event',
        data: { object: {} },
      };

      const result = await service.processWebhookEvent(event as any);

      expect(result).toBeNull();
    });
  });

  describe('handlePaymentIntentSucceeded', () => {
    it('should log and return success data', () => {
      const paymentIntent = {
        id: 'pi_123',
        amount: 10000,
        currency: 'pkr',
        metadata: {
          campaignId: 'campaign-123',
          donorEmail: 'donor@example.com',
        },
      };

      const result = (service as any).handlePaymentIntentSucceeded(paymentIntent);

      expect(result.event).toBe('payment_succeeded');
      expect(result.paymentIntentId).toBe('pi_123');
    });
  });

  describe('handlePaymentIntentFailed', () => {
    it('should log and return failure data', () => {
      const paymentIntent = {
        id: 'pi_123',
        last_payment_error: {
          message: 'Insufficient funds',
        },
      };

      const result = (service as any).handlePaymentIntentFailed(paymentIntent);

      expect(result.event).toBe('payment_failed');
      expect(result.error).toBe('Insufficient funds');
    });
  });

  describe('handlePaymentIntentCanceled', () => {
    it('should log and return canceled data', () => {
      const paymentIntent = {
        id: 'pi_123',
      };

      const result = (service as any).handlePaymentIntentCanceled(paymentIntent);

      expect(result.event).toBe('payment_canceled');
    });
  });

  describe('verifyWebhookSignature', () => {
    it('should throw BadRequestException for invalid signature', () => {
      const body = Buffer.from('{}');
      const invalidSignature = 'invalid_signature';

      expect(() =>
        service.verifyWebhookSignature(body, invalidSignature),
      ).toThrow(BadRequestException);
    });
  });
});
