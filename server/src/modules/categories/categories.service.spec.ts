import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DonationCategory } from './entities/donation-category.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryRepository: any;

  const mockCategory = {
    id: 'category-id-123',
    name: 'Food & Essentials',
    description: 'Basic necessities',
    icon: 'food-icon',
  };

  const mockCategoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(DonationCategory),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoryRepository = module.get(getRepositoryToken(DonationCategory));

    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto = {
      name: 'Healthcare',
      description: 'Medical assistance',
    };

    it('should create category successfully', async () => {
      mockCategoryRepository.findOne.mockResolvedValue(null);
      mockCategoryRepository.create.mockReturnValue(mockCategory);
      mockCategoryRepository.save.mockResolvedValue(mockCategory);

      const result = await service.create(createDto);

      expect(result).toEqual(mockCategory);
      expect(mockCategoryRepository.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw BadRequestException if category name exists', async () => {
      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const categories = [mockCategory, { ...mockCategory, id: 'cat-2' }];
      mockCategoryRepository.find.mockResolvedValue(categories);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return category when found', async () => {
      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);

      const result = await service.findOne('category-id-123');

      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException when not found', async () => {
      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateDto = { description: 'Updated description' };

    it('should update category successfully', async () => {
      mockCategoryRepository.findOne.mockResolvedValue({ ...mockCategory });
      mockCategoryRepository.save.mockResolvedValue({
        ...mockCategory,
        ...updateDto,
      });

      const result = await service.update('category-id-123', updateDto);

      expect(result.description).toBe('Updated description');
    });

    it('should throw NotFoundException if category not found', async () => {
      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(service.update('invalid-id', updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove category successfully', async () => {
      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);
      mockCategoryRepository.remove.mockResolvedValue(mockCategory);

      await expect(service.remove('category-id-123')).resolves.not.toThrow();
      expect(mockCategoryRepository.remove).toHaveBeenCalledWith(mockCategory);
    });

    it('should throw NotFoundException if category not found', async () => {
      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
