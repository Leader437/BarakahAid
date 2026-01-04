import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;
  private fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    this.initializeResend();
  }

  private initializeResend() {
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    this.fromEmail = this.configService.get<string>('RESEND_FROM_EMAIL', 'BarakahAid <noreply@barakahaid.org>');

    if (resendApiKey) {
      this.resend = new Resend(resendApiKey);
      this.logger.log('Resend email client initialized');
    } else {
      this.logger.warn('RESEND_API_KEY not configured. Emails will be logged but not sent.');
      this.resend = null;
    }
  }

  async sendPasswordResetOtp(email: string, otp: string): Promise<void> {
    const emailContent = {
      from: this.fromEmail,
      to: [email],
      subject: 'Your Password Reset OTP - BarakahAid',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset OTP</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #ffffff; border-radius: 10px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #10b981; margin: 0; font-size: 28px;">BarakahAid</h1>
              </div>
              
              <h2 style="color: #333; margin-bottom: 20px; text-align: center;">Password Reset OTP</h2>
              
              <p style="color: #666; margin-bottom: 20px; text-align: center;">
                We received a request to reset your password. Use the OTP below to proceed:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <div style="background-color: #f0fdf4; border: 2px dashed #10b981; border-radius: 10px; padding: 20px; display: inline-block;">
                  <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #10b981;">${otp}</span>
                </div>
              </div>
              
              <p style="color: #666; text-align: center; margin-bottom: 10px;">
                Enter this OTP on the password reset page to continue.
              </p>
              
              <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px;">
                <p style="color: #999; font-size: 14px; margin: 0; text-align: center;">
                  ⏰ This OTP will expire in <strong>10 minutes</strong>.<br>
                  If you didn't request a password reset, please ignore this email.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  © ${new Date().getFullYear()} BarakahAid. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset OTP - BarakahAid

        We received a request to reset your password.

        Your OTP is: ${otp}

        Enter this OTP on the password reset page to continue.

        This OTP will expire in 10 minutes. If you didn't request a password reset, please ignore this email.

        © ${new Date().getFullYear()} BarakahAid. All rights reserved.
      `,
    };

    if (this.resend) {
      try {
        const { data, error } = await this.resend.emails.send(emailContent);
        
        if (error) {
          this.logger.error(`Failed to send password reset OTP to ${email}:`, error);
          throw new Error(`Email sending failed: ${error.message}`);
        }
        
        this.logger.log(`Password reset OTP sent to ${email}: ${data?.id}`);
      } catch (error) {
        this.logger.error(`Failed to send password reset OTP to ${email}:`, error);
        throw error;
      }
    } else {
      // Log the OTP for development purposes when Resend is not configured
      this.logger.log(`[DEV] Password reset OTP for ${email}: ${otp}`);
    }
  }
}
