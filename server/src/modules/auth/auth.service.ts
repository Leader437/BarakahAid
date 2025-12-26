import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TokenUtil } from '../../utils/token.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user,
      ...tokens,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: null });
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email: forgotPasswordDto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = TokenUtil.generateResetToken();
    const hashedToken = TokenUtil.hashToken(resetToken);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = TokenUtil.getResetTokenExpiry();

    await this.userRepository.save(user);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const hashedToken = TokenUtil.hashToken(resetPasswordDto.token);

    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: hashedToken },
    });

    if (!user || !user.resetPasswordExpiry || user.resetPasswordExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;

    await this.userRepository.save(user);
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, { refreshToken: hashedRefreshToken });
  }

  /**
   * Handle OAuth login (Google)
   * Creates new user if doesn't exist, or returns existing user
   */
  async validateOAuthLogin(oauthUser: {
    googleId?: string;
    email: string;
    name: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    authProvider: 'GOOGLE';
    isEmailVerified?: boolean;
  }): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    let user: User | null = null;

    // Check if user exists by OAuth ID
    if (oauthUser.googleId) {
      user = await this.userRepository.findOne({
        where: { googleId: oauthUser.googleId },
      });
    }

    // If not found by OAuth ID, check by email
    if (!user && oauthUser.email) {
      user = await this.userRepository.findOne({
        where: { email: oauthUser.email },
      });

      // Update existing user with OAuth ID and latest profile info
      if (user) {
        if (oauthUser.googleId) {
          user.googleId = oauthUser.googleId;
        }
        user.authProvider = oauthUser.authProvider;
        user.name = oauthUser.name; // Update name from Google
        if (oauthUser.avatar && !user.avatar) {
          user.avatar = oauthUser.avatar; // Update avatar if not set
        }
        if (oauthUser.isEmailVerified) {
          user.verificationStatus = 'VERIFIED' as any; // Mark as verified if Google email is verified
        }
        await this.userRepository.save(user);
      }
    }

    // Create new user if doesn't exist
    if (!user) {
      user = this.userRepository.create({
        email: oauthUser.email,
        name: oauthUser.name,
        googleId: oauthUser.googleId,
        avatar: oauthUser.avatar,
        authProvider: oauthUser.authProvider,
        password: '', // OAuth users don't need password but field is required
        verificationStatus: oauthUser.isEmailVerified ? 'VERIFIED' as any : 'UNVERIFIED' as any,
      });
      await this.userRepository.save(user);
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user,
      ...tokens,
    };
  }
}
