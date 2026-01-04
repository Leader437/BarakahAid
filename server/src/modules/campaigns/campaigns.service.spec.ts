import { Test, TestingModule } from '@nestjs/testing';
import { CampaignsService } from './campaigns.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Campaign } from './entities/campaign.entity';
import { User } from '../users/entities/user.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';
import { CampaignStatus } from '../../common/enums/status.enum';
import { FileUploadUtil } from '../../utils/file-upload.util';

// Mock FileUploadUtil
jest.mock('../../utils/file-upload.util');

describe('CampaignsService', () => {
  let service: CampaignsService;
  let campaignRepository: any;
  let userRepository: any;

  const mockUser = {
    id: 'user-id-123',
    name: 'Test User',
    email: 'test@example.com',
  };

  const mockCampaign = {
    id: 'campaign-id-123',
    title: 'Test Campaign',
    description: 'Test description',
    goalAmount: 10000,
    raisedAmount: 5000,
    donorsCount: 10,
    status: CampaignStatus.ACTIVE,
    isEmergency: false,
    image: null,
    createdBy: mockUser,
    transactions: [],
  };

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockCampaignRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignsService,
        {
          provide: getRepositoryToken(Campaign),
          useValue: mockCampaignRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<CampaignsService>(CampaignsService);
    campaignRepository = module.get(getRepositoryToken(Campaign));
    userRepository = module.get(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto = {
      title: 'New Campaign',
      description: 'Description',
      goalAmount: 50000,
    };

    it('should create campaign without image', async () => {
      mockCampaignRepository.create.mockReturnValue(mockCampaign);
      mockCampaignRepository.save.mockResolvedValue(mockCampaign);

      const result = await service.create('user-id-123', createDto);

      expect(result).toEqual(mockCampaign);
      expect(mockCampaignRepository.create).toHaveBeenCalled();
    });

    it('should create campaign with image', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.jpg',
      } as Express.Multer.File;

      (FileUploadUtil.uploadToCloudinary as jest.Mock).mockResolvedValue(
        'https://cloudinary.com/campaign.jpg',
      );
      mockCampaignRepository.create.mockReturnValue(mockCampaign);
      mockCampaignRepository.save.mockResolvedValue(mockCampaign);

      const result = await service.create('user-id-123', createDto, mockFile);

      expect(FileUploadUtil.uploadToCloudinary).toHaveBeenCalled();
      expect(result).toEqual(mockCampaign);
    });
  });

  describe('findAll', () => {
    it('should return all campaigns', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockCampaign]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
    });

    it('should filter by status', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockCampaign]);

      await service.findAll({ status: CampaignStatus.ACTIVE });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'campaign.status = :status',
        { status: CampaignStatus.ACTIVE },
      );
    });

    it('should filter by emergency', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockCampaign]);

      await service.findAll({ isEmergency: true });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'campaign.isEmergency = :isEmergency',
        { isEmergency: true },
      );
    });

    it('should filter by search term', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockCampaign]);

      await service.findAll({ search: 'urgent' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(campaign.title ILIKE :search OR campaign.description ILIKE :search)',
        { search: '%urgent%' },
      );
    });
  });

  describe('findOne', () => {
    it('should return campaign when found', async () => {
      mockCampaignRepository.findOne.mockResolvedValue(mockCampaign);

      const result = await service.findOne('campaign-id-123');

      expect(result).toEqual(mockCampaign);
    });

    it('should throw NotFoundException when not found', async () => {
      mockCampaignRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateDto = { title: 'Updated Campaign' };

    it('should update campaign by owner', async () => {
      mockCampaignRepository.findOne.mockResolvedValue({ ...mockCampaign });
      mockCampaignRepository.save.mockResolvedValue({
        ...mockCampaign,
        ...updateDto,
      });

      const result = await service.update(
        'campaign-id-123',
        'user-id-123',
        Role.DONOR,
        updateDto,
      );

      expect(result.title).toBe('Updated Campaign');
    });

    it('should update campaign by admin', async () => {
      mockCampaignRepository.findOne.mockResolvedValue({ ...mockCampaign });
      mockCampaignRepository.save.mockResolvedValue({
        ...mockCampaign,
        ...updateDto,
      });

      const result = await service.update(
        'campaign-id-123',
        'other-user-id',
        Role.ADMIN,
        updateDto,
      );

      expect(result.title).toBe('Updated Campaign');
    });

    it('should throw ForbiddenException if not owner or admin', async () => {
      mockCampaignRepository.findOne.mockResolvedValue(mockCampaign);

      await expect(
        service.update('campaign-id-123', 'other-user-id', Role.DONOR, updateDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove campaign by owner', async () => {
      mockCampaignRepository.findOne.mockResolvedValue(mockCampaign);
      mockCampaignRepository.remove.mockResolvedValue(mockCampaign);

      await expect(
        service.remove('campaign-id-123', 'user-id-123', Role.DONOR),
      ).resolves.not.toThrow();
    });

    it('should throw ForbiddenException if not owner or admin', async () => {
      mockCampaignRepository.findOne.mockResolvedValue(mockCampaign);

      await expect(
        service.remove('campaign-id-123', 'other-user-id', Role.DONOR),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findByUserId', () => {
    it('should return campaigns by user id', async () => {
      mockCampaignRepository.find.mockResolvedValue([mockCampaign]);

      const result = await service.findByUserId('user-id-123');

      expect(result).toHaveLength(1);
    });
  });

  describe('updateRaisedAmount', () => {
    it('should update raised amount and donor count', async () => {
      mockCampaignRepository.findOne.mockResolvedValue({ ...mockCampaign });
      mockCampaignRepository.save.mockResolvedValue({
        ...mockCampaign,
        raisedAmount: 6000,
        donorsCount: 11,
      });

      await service.updateRaisedAmount('campaign-id-123', 1000);

      expect(mockCampaignRepository.save).toHaveBeenCalled();
    });

    it('should mark campaign as completed when goal reached', async () => {
      const almostCompleteCampaign = {
        ...mockCampaign,
        raisedAmount: 9500,
        goalAmount: 10000,
      };
      mockCampaignRepository.findOne.mockResolvedValue({ ...almostCompleteCampaign });
      mockCampaignRepository.save.mockImplementation((campaign) => ({
        ...campaign,
      }));

      await service.updateRaisedAmount('campaign-id-123', 1000);

      expect(mockCampaignRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: CampaignStatus.COMPLETED }),
      );
    });
  });

  describe('createEmergencyCampaign', () => {
    const disasterData = {
      id: 'disaster-1',
      type: 'EARTHQUAKE',
      location: 'Test City',
      severity: 'HIGH',
      description: 'Major earthquake',
      coordinates: { lat: 0, lng: 0 },
      timestamp: new Date().toISOString(),
    };

    it('should create emergency campaign from disaster data', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockCampaignRepository.create.mockReturnValue({
        ...mockCampaign,
        isEmergency: true,
      });
      mockCampaignRepository.save.mockResolvedValue({
        ...mockCampaign,
        isEmergency: true,
      });

      const result = await service.createEmergencyCampaign(disasterData);

      expect(result.isEmergency).toBe(true);
    });

    it('should create system user if not exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockCampaignRepository.create.mockReturnValue({
        ...mockCampaign,
        isEmergency: true,
      });
      mockCampaignRepository.save.mockResolvedValue({
        ...mockCampaign,
        isEmergency: true,
      });

      await service.createEmergencyCampaign(disasterData);

      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });

  describe('getDisasterImage', () => {
    it('should return correct image for known disaster type', () => {
      const result = (service as any).getDisasterImage('EARTHQUAKE');
      expect(result).toContain('unsplash');
    });

    it('should return default image for unknown disaster type', () => {
      const result = (service as any).getDisasterImage('UNKNOWN');
      expect(result).toContain('unsplash');
    });
  });

  describe('getTargetAmount', () => {
    it('should return correct amount for CRITICAL severity', () => {
      const result = (service as any).getTargetAmount('CRITICAL');
      expect(result).toBe(1000000);
    });

    it('should return correct amount for HIGH severity', () => {
      const result = (service as any).getTargetAmount('HIGH');
      expect(result).toBe(500000);
    });

    it('should return default amount for unknown severity', () => {
      const result = (service as any).getTargetAmount('UNKNOWN');
      expect(result).toBe(500000);
    });
  });
});
