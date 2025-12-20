import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationType } from '../../common/enums/status.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(
    userId: string,
    type: NotificationType,
    message: string,
    metadata?: any,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      user: { id: userId } as any,
      type,
      message,
      metadata,
    });

    return this.notificationRepository.save(notification);
  }

  async findByUser(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findUnread(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { user: { id: userId }, read: false },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string, userId: string): Promise<void> {
    await this.notificationRepository.update(
      { id, user: { id: userId } },
      { read: true },
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { user: { id: userId }, read: false },
      { read: true },
    );
  }

  async createDonationNotification(
    userId: string,
    campaign: any,
    amount: number,
  ): Promise<void> {
    await this.create(
      userId,
      NotificationType.DONATION,
      `Your donation of $${amount} to "${campaign.title}" has been processed successfully.`,
      { campaignId: campaign.id, amount },
    );
  }

  async createEmergencyNotification(userId: string, campaign: any): Promise<void> {
    await this.create(
      userId,
      NotificationType.EMERGENCY,
      `Emergency campaign "${campaign.title}" has been created. Your help is needed!`,
      { campaignId: campaign.id },
    );
  }
}
