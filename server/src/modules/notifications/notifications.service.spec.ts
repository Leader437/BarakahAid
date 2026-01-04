import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationType } from '../../common/enums/status.enum';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let notificationRepository: any;

  const mockNotification = {
    id: 'notification-id-123',
    message: 'Test notification',
    type: NotificationType.DONATION,
    read: false,
    user: { id: 'user-id-123' },
    createdAt: new Date(),
  };

  const mockNotificationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getRepositoryToken(Notification),
          useValue: mockNotificationRepository,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    notificationRepository = module.get(getRepositoryToken(Notification));

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create notification successfully', async () => {
      mockNotificationRepository.create.mockReturnValue(mockNotification);
      mockNotificationRepository.save.mockResolvedValue(mockNotification);

      const result = await service.create(
        'user-id-123',
        NotificationType.DONATION,
        'Test message',
        { amount: 100 },
      );

      expect(result).toEqual(mockNotification);
      expect(mockNotificationRepository.create).toHaveBeenCalled();
    });

    it('should create notification without metadata', async () => {
      mockNotificationRepository.create.mockReturnValue(mockNotification);
      mockNotificationRepository.save.mockResolvedValue(mockNotification);

      const result = await service.create(
        'user-id-123',
        NotificationType.EMERGENCY,
        'Emergency alert',
      );

      expect(result).toEqual(mockNotification);
    });
  });

  describe('findByUser', () => {
    it('should return notifications ordered by date', async () => {
      mockNotificationRepository.find.mockResolvedValue([mockNotification]);

      const result = await service.findByUser('user-id-123');

      expect(result).toHaveLength(1);
      expect(mockNotificationRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 'user-id-123' } },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findUnread', () => {
    it('should return only unread notifications', async () => {
      mockNotificationRepository.find.mockResolvedValue([mockNotification]);

      const result = await service.findUnread('user-id-123');

      expect(result).toHaveLength(1);
      expect(mockNotificationRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 'user-id-123' }, read: false },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      mockNotificationRepository.update.mockResolvedValue({ affected: 1 });

      await service.markAsRead('notification-id-123', 'user-id-123');

      expect(mockNotificationRepository.update).toHaveBeenCalledWith(
        { id: 'notification-id-123', user: { id: 'user-id-123' } },
        { read: true },
      );
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read for user', async () => {
      mockNotificationRepository.update.mockResolvedValue({ affected: 5 });

      await service.markAllAsRead('user-id-123');

      expect(mockNotificationRepository.update).toHaveBeenCalledWith(
        { user: { id: 'user-id-123' }, read: false },
        { read: true },
      );
    });
  });

  describe('createDonationNotification', () => {
    it('should create donation notification with correct message', async () => {
      mockNotificationRepository.create.mockReturnValue(mockNotification);
      mockNotificationRepository.save.mockResolvedValue(mockNotification);

      const campaign = { id: 'campaign-123', title: 'Test Campaign' };
      await service.createDonationNotification('user-id-123', campaign, 100);

      expect(mockNotificationRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.DONATION,
          message: expect.stringContaining('100'),
          metadata: expect.objectContaining({ campaignId: 'campaign-123' }),
        }),
      );
    });
  });

  describe('createEmergencyNotification', () => {
    it('should create emergency notification with correct message', async () => {
      mockNotificationRepository.create.mockReturnValue(mockNotification);
      mockNotificationRepository.save.mockResolvedValue(mockNotification);

      const campaign = { id: 'campaign-123', title: 'Emergency Campaign' };
      await service.createEmergencyNotification('user-id-123', campaign);

      expect(mockNotificationRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.EMERGENCY,
          message: expect.stringContaining('Emergency Campaign'),
        }),
      );
    });
  });
});
