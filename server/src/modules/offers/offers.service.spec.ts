import { Test, TestingModule } from '@nestjs/testing';
import { OffersService } from './offers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DonationOffer } from './entities/donation-offer.entity';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { DonationOfferStatus } from '../../common/enums/status.enum';
import { Role } from '../../common/enums/role.enum';
import { FileUploadUtil } from '../../utils/file-upload.util';

jest.mock('../../utils/file-upload.util');

describe('OffersService', () => {
  let service: OffersService;
  let offerRepository: any;

  const mockDonor = { id: 'donor-id-123', name: 'Test Donor' };
  const mockNgo = { id: 'ngo-id-123', name: 'Test NGO' };

  const mockOffer = {
    id: 'offer-id-123',
    title: 'Test Offer',
    description: 'Description',
    status: DonationOfferStatus.AVAILABLE,
    images: [],
    donor: mockDonor,
    claimedBy: null,
    createdAt: new Date(),
  };

  const mockOfferRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OffersService,
        {
          provide: getRepositoryToken(DonationOffer),
          useValue: mockOfferRepository,
        },
      ],
    }).compile();

    service = module.get<OffersService>(OffersService);
    offerRepository = module.get(getRepositoryToken(DonationOffer));

    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto = {
      title: 'New Offer',
      description: 'Description',
      quantity: 5,
    };

    it('should create offer without images', async () => {
      mockOfferRepository.create.mockReturnValue(mockOffer);
      mockOfferRepository.save.mockResolvedValue(mockOffer);

      const result = await service.create('donor-id-123', createDto);

      expect(result).toEqual(mockOffer);
    });

    it('should create offer with images', async () => {
      const mockFiles = [
        { buffer: Buffer.from('test'), originalname: 'test.jpg' },
      ] as Express.Multer.File[];

      (FileUploadUtil.uploadMultipleToCloudinary as jest.Mock).mockResolvedValue([
        'https://cloudinary.com/image.jpg',
      ]);
      mockOfferRepository.create.mockReturnValue(mockOffer);
      mockOfferRepository.save.mockResolvedValue(mockOffer);

      const result = await service.create('donor-id-123', createDto, mockFiles);

      expect(FileUploadUtil.uploadMultipleToCloudinary).toHaveBeenCalled();
      expect(result).toEqual(mockOffer);
    });
  });

  describe('findAll', () => {
    it('should return all offers ordered by date', async () => {
      mockOfferRepository.find.mockResolvedValue([mockOffer]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(mockOfferRepository.find).toHaveBeenCalledWith({
        relations: ['donor'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findAvailable', () => {
    it('should return only available offers', async () => {
      mockOfferRepository.find.mockResolvedValue([mockOffer]);

      const result = await service.findAvailable();

      expect(mockOfferRepository.find).toHaveBeenCalledWith({
        where: { status: DonationOfferStatus.AVAILABLE },
        relations: ['donor'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return offer when found', async () => {
      mockOfferRepository.findOne.mockResolvedValue(mockOffer);

      const result = await service.findOne('offer-id-123');

      expect(result).toEqual(mockOffer);
    });

    it('should throw NotFoundException when not found', async () => {
      mockOfferRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('claim', () => {
    it('should claim offer by NGO', async () => {
      mockOfferRepository.findOne.mockResolvedValue({ ...mockOffer });
      mockOfferRepository.save.mockResolvedValue({
        ...mockOffer,
        status: DonationOfferStatus.CLAIMED,
        claimedBy: mockNgo,
      });

      const result = await service.claim('offer-id-123', 'ngo-id-123', Role.NGO);

      expect(result.status).toBe(DonationOfferStatus.CLAIMED);
    });

    it('should throw BadRequestException if offer not available', async () => {
      mockOfferRepository.findOne.mockResolvedValue({
        ...mockOffer,
        status: DonationOfferStatus.CLAIMED,
      });

      await expect(
        service.claim('offer-id-123', 'ngo-id-123', Role.NGO),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException if not NGO', async () => {
      mockOfferRepository.findOne.mockResolvedValue(mockOffer);

      await expect(
        service.claim('offer-id-123', 'donor-id-123', Role.DONOR),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('updateStatus', () => {
    it('should update status by donor', async () => {
      mockOfferRepository.findOne.mockResolvedValue({ ...mockOffer });
      mockOfferRepository.save.mockResolvedValue({
        ...mockOffer,
        status: DonationOfferStatus.DELIVERED,
      });

      const result = await service.updateStatus(
        'offer-id-123',
        'donor-id-123',
        DonationOfferStatus.DELIVERED,
      );

      expect(result.status).toBe(DonationOfferStatus.DELIVERED);
    });

    it('should throw ForbiddenException if not owner or claimer', async () => {
      mockOfferRepository.findOne.mockResolvedValue(mockOffer);

      await expect(
        service.updateStatus('offer-id-123', 'other-user', DonationOfferStatus.DELIVERED),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findByDonor', () => {
    it('should return offers by donor', async () => {
      mockOfferRepository.find.mockResolvedValue([mockOffer]);

      const result = await service.findByDonor('donor-id-123');

      expect(result).toHaveLength(1);
    });
  });

  describe('remove', () => {
    it('should remove offer by owner', async () => {
      mockOfferRepository.findOne.mockResolvedValue(mockOffer);
      mockOfferRepository.remove.mockResolvedValue(mockOffer);

      await expect(
        service.remove('offer-id-123', 'donor-id-123'),
      ).resolves.not.toThrow();
    });

    it('should throw ForbiddenException if not owner', async () => {
      mockOfferRepository.findOne.mockResolvedValue(mockOffer);

      await expect(
        service.remove('offer-id-123', 'other-user-id'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
