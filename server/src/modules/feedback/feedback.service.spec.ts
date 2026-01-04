import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackService } from './feedback.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let feedbackRepository: any;

  const mockFeedback = {
    id: 'feedback-id-123',
    rating: 5,
    comment: 'Great service!',
    donor: { id: 'donor-id-123', name: 'Test Donor' },
    ngo: { id: 'ngo-id-123', name: 'Test NGO' },
    createdAt: new Date(),
  };

  const mockFeedbackRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawOne: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          provide: getRepositoryToken(Feedback),
          useValue: mockFeedbackRepository,
        },
      ],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
    feedbackRepository = module.get(getRepositoryToken(Feedback));

    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto = {
      rating: 5,
      comment: 'Excellent',
      ngoId: 'ngo-id-123',
    };

    it('should create feedback successfully', async () => {
      mockFeedbackRepository.create.mockReturnValue(mockFeedback);
      mockFeedbackRepository.save.mockResolvedValue(mockFeedback);

      const result = await service.create('donor-id-123', createDto);

      expect(result).toEqual(mockFeedback);
      expect(mockFeedbackRepository.create).toHaveBeenCalled();
    });
  });

  describe('findByNgo', () => {
    it('should return feedback for NGO ordered by date', async () => {
      mockFeedbackRepository.find.mockResolvedValue([mockFeedback]);

      const result = await service.findByNgo('ngo-id-123');

      expect(result).toHaveLength(1);
      expect(mockFeedbackRepository.find).toHaveBeenCalledWith({
        where: { ngo: { id: 'ngo-id-123' } },
        relations: ['donor'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findByDonor', () => {
    it('should return feedback by donor ordered by date', async () => {
      mockFeedbackRepository.find.mockResolvedValue([mockFeedback]);

      const result = await service.findByDonor('donor-id-123');

      expect(result).toHaveLength(1);
      expect(mockFeedbackRepository.find).toHaveBeenCalledWith({
        where: { donor: { id: 'donor-id-123' } },
        relations: ['ngo'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('getAverageRating', () => {
    it('should return average rating for NGO', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ avg: '4.5' }),
      };
      mockFeedbackRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getAverageRating('ngo-id-123');

      expect(result).toBe(4.5);
    });

    it('should return 0 when no ratings exist', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ avg: null }),
      };
      mockFeedbackRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getAverageRating('ngo-id-123');

      expect(result).toBe(0);
    });
  });
});
