import { Test, TestingModule } from '@nestjs/testing';
import { DonationsService } from './donations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DonationRequest } from './entities/donation-request.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';
import { DonationRequestStatus } from '../../common/enums/status.enum';
import { FileUploadUtil } from '../../utils/file-upload.util';

// Mock FileUploadUtil
jest.mock('../../utils/file-upload.util');

describe('DonationsService', () => {
  let service: DonationsService;
  let donationRepository: any;

  const mockUser = {
    id: 'user-id-123',
    name: 'Test User',
  };

  const mockDonationRequest = {
    id: 'request-id-123',
    title: 'Test Request',
    description: 'Test description',
    targetAmount: 1000,
    currentAmount: 500,
    status: DonationRequestStatus.APPROVED,
    media: [],
    createdBy: mockUser,
    category: { id: 'cat-1', name: 'Food' },
  };

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockDonationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DonationsService,
        {
          provide: getRepositoryToken(DonationRequest),
          useValue: mockDonationRepository,
        },
      ],
    }).compile();

    service = module.get<DonationsService>(DonationsService);
    donationRepository = module.get(getRepositoryToken(DonationRequest));

    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto = {
      title: 'New Request',
      description: 'Description',
      targetAmount: 5000,
      categoryId: 'cat-1',
    };

    it('should create donation request without files', async () => {
      mockDonationRepository.create.mockReturnValue(mockDonationRequest);
      mockDonationRepository.save.mockResolvedValue(mockDonationRequest);

      const result = await service.create('user-id-123', createDto);

      expect(result).toEqual(mockDonationRequest);
      expect(mockDonationRepository.create).toHaveBeenCalled();
    });

    it('should create donation request with files', async () => {
      const mockFiles = [
        { buffer: Buffer.from('test'), originalname: 'test.jpg' },
      ] as Express.Multer.File[];

      (FileUploadUtil.uploadMultipleToCloudinary as jest.Mock).mockResolvedValue([
        'https://cloudinary.com/image.jpg',
      ]);
      mockDonationRepository.create.mockReturnValue(mockDonationRequest);
      mockDonationRepository.save.mockResolvedValue(mockDonationRequest);

      const result = await service.create('user-id-123', createDto, mockFiles);

      expect(FileUploadUtil.uploadMultipleToCloudinary).toHaveBeenCalled();
      expect(result).toEqual(mockDonationRequest);
    });
  });

  describe('findAll', () => {
    it('should return all approved donation requests by default', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockDonationRequest]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'request.status = :status',
        { status: DonationRequestStatus.APPROVED },
      );
    });

    it('should filter by category', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockDonationRequest]);

      await service.findAll({ categoryId: 'cat-1' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'category.id = :categoryId',
        { categoryId: 'cat-1' },
      );
    });

    it('should filter by status', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockDonationRequest]);

      await service.findAll({ status: DonationRequestStatus.PENDING });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'request.status = :status',
        { status: DonationRequestStatus.PENDING },
      );
    });

    it('should filter by search term', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockDonationRequest]);

      await service.findAll({ search: 'test' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(request.title ILIKE :search OR request.description ILIKE :search)',
        { search: '%test%' },
      );
    });

    it('should include all statuses when includeAll is true', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockDonationRequest]);

      await service.findAll({ includeAll: true });

      // Should not add status filter when includeAll is true
      const statusCalls = mockQueryBuilder.andWhere.mock.calls.filter(
        (call) => call[0].includes('status'),
      );
      expect(statusCalls).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return donation request when found', async () => {
      mockDonationRepository.findOne.mockResolvedValue(mockDonationRequest);

      const result = await service.findOne('request-id-123');

      expect(result).toEqual(mockDonationRequest);
    });

    it('should throw NotFoundException when not found', async () => {
      mockDonationRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateDto = { title: 'Updated Title' };

    it('should update request by owner', async () => {
      mockDonationRepository.findOne.mockResolvedValue({ ...mockDonationRequest });
      mockDonationRepository.save.mockResolvedValue({
        ...mockDonationRequest,
        ...updateDto,
      });

      const result = await service.update(
        'request-id-123',
        'user-id-123',
        Role.DONOR,
        updateDto,
      );

      expect(result.title).toBe('Updated Title');
    });

    it('should update request by admin', async () => {
      mockDonationRepository.findOne.mockResolvedValue({ ...mockDonationRequest });
      mockDonationRepository.save.mockResolvedValue({
        ...mockDonationRequest,
        ...updateDto,
      });

      const result = await service.update(
        'request-id-123',
        'other-user-id',
        Role.ADMIN,
        updateDto,
      );

      expect(result.title).toBe('Updated Title');
    });

    it('should throw ForbiddenException if not owner or admin', async () => {
      mockDonationRepository.findOne.mockResolvedValue(mockDonationRequest);

      await expect(
        service.update('request-id-123', 'other-user-id', Role.DONOR, updateDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove request by owner', async () => {
      mockDonationRepository.findOne.mockResolvedValue(mockDonationRequest);
      mockDonationRepository.remove.mockResolvedValue(mockDonationRequest);

      await expect(
        service.remove('request-id-123', 'user-id-123', Role.DONOR),
      ).resolves.not.toThrow();
    });

    it('should remove request by admin', async () => {
      mockDonationRepository.findOne.mockResolvedValue(mockDonationRequest);
      mockDonationRepository.remove.mockResolvedValue(mockDonationRequest);

      await expect(
        service.remove('request-id-123', 'other-user-id', Role.ADMIN),
      ).resolves.not.toThrow();
    });

    it('should throw ForbiddenException if not owner or admin', async () => {
      mockDonationRepository.findOne.mockResolvedValue(mockDonationRequest);

      await expect(
        service.remove('request-id-123', 'other-user-id', Role.DONOR),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findByUserId', () => {
    it('should return requests by user id', async () => {
      mockDonationRepository.find.mockResolvedValue([mockDonationRequest]);

      const result = await service.findByUserId('user-id-123');

      expect(result).toHaveLength(1);
      expect(mockDonationRepository.find).toHaveBeenCalledWith({
        where: { createdBy: { id: 'user-id-123' } },
        relations: ['category'],
      });
    });
  });

  describe('updateCurrentAmount', () => {
    it('should update current amount successfully', async () => {
      mockDonationRepository.findOne.mockResolvedValue({ ...mockDonationRequest });
      mockDonationRepository.save.mockResolvedValue({
        ...mockDonationRequest,
        currentAmount: 600,
      });

      const result = await service.updateCurrentAmount('request-id-123', 100);

      expect(result.currentAmount).toBe(600);
    });

    it('should throw NotFoundException if request not found', async () => {
      mockDonationRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateCurrentAmount('invalid-id', 100),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
