import { Test, TestingModule } from '@nestjs/testing';
import { EmergencyService } from './emergency.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { DisasterFeedUtil, DisasterAlert } from './utils/disaster-feed.util';
import { UsersService } from '../users/users.service';

describe('EmergencyService', () => {
  let service: EmergencyService;
  let campaignsService: any;
  let disasterFeedUtil: any;
  let usersService: any;

  const mockUser = {
    id: 'admin-id-123',
    name: 'Admin User',
    role: 'ADMIN',
  };

  const mockDisasterAlert: DisasterAlert = {
    id: 'alert-123',
    type: 'EARTHQUAKE',
    severity: 'HIGH',
    location: 'Test City',
    description: 'Major earthquake',
    source: 'USGS',
    timestamp: new Date(),
    coordinates: { lat: 0, lng: 0 },
  };

  const mockCampaignsService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  const mockDisasterFeedUtil = {
    getAllDisasterAlerts: jest.fn(),
  };

  const mockUsersService = {
    findByRole: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmergencyService,
        {
          provide: CampaignsService,
          useValue: mockCampaignsService,
        },
        {
          provide: DisasterFeedUtil,
          useValue: mockDisasterFeedUtil,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<EmergencyService>(EmergencyService);
    campaignsService = module.get(CampaignsService);
    disasterFeedUtil = module.get(DisasterFeedUtil);
    usersService = module.get(UsersService);

    jest.clearAllMocks();
  });

  describe('checkEmergencyFeeds', () => {
    it('should log message when no disasters detected', async () => {
      mockDisasterFeedUtil.getAllDisasterAlerts.mockResolvedValue([]);

      await service.checkEmergencyFeeds();

      expect(mockDisasterFeedUtil.getAllDisasterAlerts).toHaveBeenCalled();
    });

    it('should process critical alerts', async () => {
      mockDisasterFeedUtil.getAllDisasterAlerts.mockResolvedValue([mockDisasterAlert]);
      mockUsersService.findByRole.mockResolvedValue(mockUser);
      mockCampaignsService.create.mockResolvedValue({ id: 'campaign-123' });

      await service.checkEmergencyFeeds();

      expect(mockDisasterFeedUtil.getAllDisasterAlerts).toHaveBeenCalled();
    });
  });

  describe('getEmergencyCampaigns', () => {
    it('should return emergency campaigns', async () => {
      mockCampaignsService.findAll.mockResolvedValue([]);

      const result = await service.getEmergencyCampaigns();

      expect(mockCampaignsService.findAll).toHaveBeenCalledWith({ isEmergency: true });
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array on error', async () => {
      mockCampaignsService.findAll.mockRejectedValue(new Error('DB error'));

      const result = await service.getEmergencyCampaigns();

      expect(result).toEqual([]);
    });
  });

  describe('getCurrentDisasterAlerts', () => {
    it('should return disaster alerts from last 24 hours', async () => {
      mockDisasterFeedUtil.getAllDisasterAlerts.mockResolvedValue([mockDisasterAlert]);

      const result = await service.getCurrentDisasterAlerts();

      expect(Array.isArray(result)).toBe(true);
    });

    it('should include demo data when flag is true', async () => {
      mockDisasterFeedUtil.getAllDisasterAlerts.mockResolvedValue([mockDisasterAlert]);

      await service.getCurrentDisasterAlerts(true);

      expect(mockDisasterFeedUtil.getAllDisasterAlerts).toHaveBeenCalledWith(true);
    });

    it('should return empty array on error', async () => {
      mockDisasterFeedUtil.getAllDisasterAlerts.mockRejectedValue(new Error('API error'));

      const result = await service.getCurrentDisasterAlerts();

      expect(result).toEqual([]);
    });
  });

  describe('calculateGoalAmount', () => {
    it('should calculate correct amount for EARTHQUAKE with HIGH severity', () => {
      const result = (service as any).calculateGoalAmount({
        type: 'EARTHQUAKE',
        severity: 'HIGH',
      });

      expect(result).toBe(750000); // 500000 * 1.5
    });

    it('should calculate correct amount for CRITICAL severity', () => {
      const result = (service as any).calculateGoalAmount({
        type: 'FLOOD',
        severity: 'CRITICAL',
      });

      expect(result).toBe(600000); // 300000 * 2.0
    });

    it('should use default amount for unknown disaster type', () => {
      const result = (service as any).calculateGoalAmount({
        type: 'UNKNOWN',
        severity: 'MEDIUM',
      });

      expect(result).toBe(300000); // default * 1.0
    });
  });

  describe('mapDisasterToCategory', () => {
    it('should map EARTHQUAKE to Emergency Relief', () => {
      const result = (service as any).mapDisasterToCategory('EARTHQUAKE');
      expect(result).toBe('Emergency Relief');
    });

    it('should map HEATWAVE to Medical Aid', () => {
      const result = (service as any).mapDisasterToCategory('HEATWAVE');
      expect(result).toBe('Medical Aid');
    });

    it('should map DROUGHT to Food & Water', () => {
      const result = (service as any).mapDisasterToCategory('DROUGHT');
      expect(result).toBe('Food & Water');
    });

    it('should return default for unknown type', () => {
      const result = (service as any).mapDisasterToCategory('UNKNOWN');
      expect(result).toBe('Emergency Relief');
    });
  });
});
