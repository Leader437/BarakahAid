import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { VerificationStatus } from '../../common/enums/status.enum';
import { FileUploadUtil } from '../../utils/file-upload.util';

// Mock FileUploadUtil
jest.mock('../../utils/file-upload.util');

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: any;

  const mockUser = {
    id: 'user-id-123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'DONOR',
    profileImage: null,
    notificationPreferences: { email: true, push: true },
    verificationStatus: VerificationStatus.UNVERIFIED,
    verificationDocuments: [],
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user when found by id', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById('user-id-123');

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    const updateDto = { name: 'Updated Name', phone: '1234567890' };

    it('should update user profile successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue({ ...mockUser });
      mockUserRepository.save.mockResolvedValue({ ...mockUser, ...updateDto });

      const result = await service.updateProfile('user-id-123', updateDto);

      expect(result.name).toBe('Updated Name');
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateProfile('invalid-id', updateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('uploadProfileImage', () => {
    const mockFile = {
      buffer: Buffer.from('test'),
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    it('should upload profile image successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue({ ...mockUser });
      (FileUploadUtil.uploadToCloudinary as jest.Mock).mockResolvedValue(
        'https://cloudinary.com/image.jpg',
      );
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        profileImage: 'https://cloudinary.com/image.jpg',
      });

      const result = await service.uploadProfileImage('user-id-123', mockFile);

      expect(result.profileImage).toBe('https://cloudinary.com/image.jpg');
    });

    it('should delete old image before uploading new one', async () => {
      const userWithImage = {
        ...mockUser,
        profileImage: 'https://old-image.com/image.jpg',
      };
      mockUserRepository.findOne.mockResolvedValue(userWithImage);
      (FileUploadUtil.deleteFromCloudinary as jest.Mock).mockResolvedValue(true);
      (FileUploadUtil.uploadToCloudinary as jest.Mock).mockResolvedValue(
        'https://cloudinary.com/new-image.jpg',
      );
      mockUserRepository.save.mockResolvedValue({
        ...userWithImage,
        profileImage: 'https://cloudinary.com/new-image.jpg',
      });

      await service.uploadProfileImage('user-id-123', mockFile);

      expect(FileUploadUtil.deleteFromCloudinary).toHaveBeenCalledWith(
        'https://old-image.com/image.jpg',
      );
    });
  });

  describe('updateNotificationPreferences', () => {
    it('should update notification preferences', async () => {
      const preferences = { email: false, push: true };
      mockUserRepository.findOne.mockResolvedValue({ ...mockUser });
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        notificationPreferences: preferences,
      });

      const result = await service.updateNotificationPreferences(
        'user-id-123',
        preferences,
      );

      expect(result.notificationPreferences).toEqual(preferences);
    });
  });

  describe('submitVerificationDocuments', () => {
    const mockFiles = [
      { buffer: Buffer.from('doc1'), originalname: 'doc1.pdf' },
      { buffer: Buffer.from('doc2'), originalname: 'doc2.pdf' },
    ] as Express.Multer.File[];

    it('should submit verification documents successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue({ ...mockUser });
      (FileUploadUtil.uploadMultipleToCloudinary as jest.Mock).mockResolvedValue([
        'https://cloudinary.com/doc1.pdf',
        'https://cloudinary.com/doc2.pdf',
      ]);
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        verificationStatus: VerificationStatus.PENDING,
      });

      const result = await service.submitVerificationDocuments(
        'user-id-123',
        mockFiles,
      );

      expect(result.verificationStatus).toBe(VerificationStatus.PENDING);
    });

    it('should throw BadRequestException if user already verified', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        ...mockUser,
        verificationStatus: VerificationStatus.VERIFIED,
      });

      await expect(
        service.submitVerificationDocuments('user-id-123', mockFiles),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateVerificationStatus', () => {
    it('should update verification status', async () => {
      mockUserRepository.findOne.mockResolvedValue({ ...mockUser });
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        verificationStatus: VerificationStatus.VERIFIED,
      });

      const result = await service.updateVerificationStatus(
        'user-id-123',
        VerificationStatus.VERIFIED,
      );

      expect(result.verificationStatus).toBe(VerificationStatus.VERIFIED);
    });
  });

  describe('findByRole', () => {
    it('should return user by role', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByRole('DONOR');

      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [mockUser, { ...mockUser, id: 'user-2' }];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(mockUser);

      await expect(service.deleteUser('user-id-123')).resolves.not.toThrow();
      expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteUser('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUserRole', () => {
    it('should update user role successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue({ ...mockUser });
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        role: 'ADMIN',
      });

      const result = await service.updateUserRole('user-id-123', 'ADMIN');

      expect(result.role).toBe('ADMIN');
    });
  });
});
