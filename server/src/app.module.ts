import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { getTypeOrmConfig } from './config/typeorm.config';
import { CloudinaryProvider } from './config/cloudinary.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { DonationsModule } from './modules/donations/donations.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { OffersModule } from './modules/offers/offers.module';
import { VolunteersModule } from './modules/volunteers/volunteers.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { EmergencyModule } from './modules/emergency/emergency.module';
import { PaymentModule } from './modules/payments/payment.module';
import { EmailModule } from './modules/email/email.module';
import { NotificationsGateway } from './modules/notifications/notifications.gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    CategoriesModule,
    DonationsModule,
    CampaignsModule,
    TransactionsModule,
    OffersModule,
    VolunteersModule,
    FeedbackModule,
    NotificationsModule,
    AdminModule,
    EmergencyModule,
    PaymentModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CloudinaryProvider,
    NotificationsGateway,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
