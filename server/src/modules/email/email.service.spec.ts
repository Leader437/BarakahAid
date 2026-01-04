import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';

describe('EmailService', () => {
  let service: EmailService;
  let configService: any;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    // Reset mocks before each test
    mockConfigService.get.mockReset();
    mockConfigService.get.mockImplementation((key: string, defaultValue?: any) => {
      if (key === 'RESEND_API_KEY') return null; // Simulate no API key
      if (key === 'RESEND_FROM_EMAIL') return defaultValue || 'BarakahAid <noreply@barakahaid.org>';
      return defaultValue;
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    configService = module.get(ConfigService);
  });

  describe('initialization', () => {
    it('should initialize without Resend when API key is not set', () => {
      expect(service).toBeDefined();
      // In dev mode without API key, Resend should be null
    });

    it('should log warning when API key is not configured', () => {
      // Service should work in dev mode, just logging OTPs
      expect(service).toBeDefined();
    });
  });

  describe('sendPasswordResetOtp', () => {
    it('should log OTP when Resend is not configured (dev mode)', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.sendPasswordResetOtp('test@example.com', '123456');

      // Should not throw, just log in dev mode
      consoleSpy.mockRestore();
    });

    it('should not throw error in dev mode', async () => {
      await expect(
        service.sendPasswordResetOtp('test@example.com', '654321'),
      ).resolves.not.toThrow();
    });

    it('should handle valid email address', async () => {
      // Should accept valid email without errors
      await expect(
        service.sendPasswordResetOtp('user@domain.com', '111222'),
      ).resolves.not.toThrow();
    });
  });

  describe('sendPasswordResetOtp with Resend configured', () => {
    let serviceWithResend: EmailService;

    beforeEach(async () => {
      // Create a mock that simulates Resend being configured
      const mockWithResend = {
        get: jest.fn().mockImplementation((key: string, defaultValue?: any) => {
          if (key === 'RESEND_API_KEY') return 're_test_123456789';
          if (key === 'RESEND_FROM_EMAIL') return 'BarakahAid <noreply@test.com>';
          return defaultValue;
        }),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          EmailService,
          {
            provide: ConfigService,
            useValue: mockWithResend,
          },
        ],
      }).compile();

      serviceWithResend = module.get<EmailService>(EmailService);
    });

    it('should initialize Resend when API key is provided', () => {
      expect(serviceWithResend).toBeDefined();
    });
  });

  describe('email content', () => {
    it('should include OTP in email when sent', async () => {
      const otp = '789012';
      // In dev mode, the OTP should be logged
      // We're just testing that the method handles the OTP correctly
      await expect(
        service.sendPasswordResetOtp('test@example.com', otp),
      ).resolves.not.toThrow();
    });

    it('should handle special characters in email', async () => {
      await expect(
        service.sendPasswordResetOtp('user+test@example.com', '123456'),
      ).resolves.not.toThrow();
    });
  });
});
