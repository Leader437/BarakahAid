import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { EmailService } from '../email/email.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: any;
  let jwtService: any;
  let configService: any;
  let emailService: any;

  const mockUser = {
    id: 'user-id-123',
    email: 'test@example.com',
    password: 'hashedPassword123',
    name: 'Test User',
    role: 'DONOR',
    refreshToken: 'hashedRefreshToken',
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockEmailService = {
    sendPasswordResetOtp: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    emailService = module.get(EmailService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
      role: 'DONOR',
    };

    it('should register a new user successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockUserRepository.create.mockReturnValue({ ...registerDto, id: 'new-id' });
      mockUserRepository.save.mockResolvedValue({ ...registerDto, id: 'new-id' });
      mockJwtService.sign.mockReturnValue('accessToken');
      mockConfigService.get.mockReturnValue('secret');

      const result = await service.register(registerDto as any);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
    });

    it('should throw BadRequestException if email already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.register(registerDto as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully with valid credentials', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('accessToken');
      mockConfigService.get.mockReturnValue('secret');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should clear refresh token on logout', async () => {
      await service.logout('user-id-123');

      expect(mockUserRepository.update).toHaveBeenCalledWith('user-id-123', {
        refreshToken: null,
      });
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('newAccessToken');
      mockConfigService.get.mockReturnValue('secret');

      const result = await service.refreshTokens('user-id-123', 'refreshToken');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.refreshTokens('user-id-123', 'refreshToken'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.refreshTokens('user-id-123', 'invalidToken'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('forgotPassword', () => {
    it('should send OTP email when user exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      await service.forgotPassword({ email: 'test@example.com' });

      expect(mockEmailService.sendPasswordResetOtp).toHaveBeenCalled();
    });

    it('should not throw error when user does not exist (security)', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.forgotPassword({ email: 'nonexistent@example.com' }),
      ).resolves.not.toThrow();
    });
  });

  describe('verifyOtp', () => {
    it('should return true for valid OTP', async () => {
      const userWithOtp = {
        ...mockUser,
        resetPasswordOtp: 'hashedOtp',
        resetPasswordOtpExpiry: new Date(Date.now() + 600000), // 10 mins from now
      };
      mockUserRepository.findOne.mockResolvedValue(userWithOtp);

      const result = await service.verifyOtp('test@example.com', '123456');

      expect(result).toBe(true);
    });

    it('should throw BadRequestException for invalid OTP', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.verifyOtp('test@example.com', 'wrongOtp'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for expired OTP', async () => {
      const userWithExpiredOtp = {
        ...mockUser,
        resetPasswordOtp: 'hashedOtp',
        resetPasswordOtpExpiry: new Date(Date.now() - 1000), // expired
      };
      mockUserRepository.findOne.mockResolvedValue(userWithExpiredOtp);

      await expect(
        service.verifyOtp('test@example.com', '123456'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('resetPassword', () => {
    const resetDto = {
      email: 'test@example.com',
      otp: '123456',
      newPassword: 'newPassword123',
    };

    it('should reset password successfully', async () => {
      const userWithOtp = {
        ...mockUser,
        resetPasswordOtp: 'hashedOtp',
        resetPasswordOtpExpiry: new Date(Date.now() + 600000),
      };
      mockUserRepository.findOne.mockResolvedValue(userWithOtp);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      mockUserRepository.save.mockResolvedValue(userWithOtp);

      await expect(service.resetPassword(resetDto)).resolves.not.toThrow();
    });

    it('should throw BadRequestException for invalid/expired OTP', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.resetPassword(resetDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return user if found', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser('user-id-123');

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.validateUser('invalid-id')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateOAuthLogin', () => {
    const oauthUser = {
      googleId: 'google-123',
      email: 'oauth@example.com',
      name: 'OAuth User',
      authProvider: 'GOOGLE' as const,
    };

    it('should return existing user found by googleId', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('accessToken');
      mockConfigService.get.mockReturnValue('secret');

      const result = await service.validateOAuthLogin(oauthUser);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
    });

    it('should create new user if not exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({ ...oauthUser, id: 'new-id' });
      mockUserRepository.save.mockResolvedValue({ ...oauthUser, id: 'new-id' });
      mockJwtService.sign.mockReturnValue('accessToken');
      mockConfigService.get.mockReturnValue('secret');

      const result = await service.validateOAuthLogin(oauthUser);

      expect(result).toHaveProperty('user');
      expect(mockUserRepository.create).toHaveBeenCalled();
    });
  });
});
