import { Test, TestingModule } from '@nestjs/testing';
import { VolunteersService } from './volunteers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VolunteerProfile } from './entities/volunteer-profile.entity';
import { VolunteerEvent } from './entities/volunteer-event.entity';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { FileUploadUtil } from '../../utils/file-upload.util';

// Mock FileUploadUtil
jest.mock('../../utils/file-upload.util');

describe('VolunteersService', () => {
  let service: VolunteersService;
  let profileRepository: any;
  let eventRepository: any;

  const mockUser = {
    id: 'user-id-123',
    name: 'Test User',
  };

  const mockVolunteerProfile = {
    id: 'profile-id-123',
    skills: ['first-aid', 'driving'],
    hoursLogged: 50,
    user: mockUser,
    events: [],
  };

  const mockVolunteerEvent = {
    id: 'event-id-123',
    title: 'Community Cleanup',
    description: 'Cleaning the park',
    location: 'Central Park',
    eventDate: new Date(),
    maxVolunteers: 20,
    image: null,
    volunteers: [],
    createdBy: mockUser,
  };

  const mockProfileRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockEventRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VolunteersService,
        {
          provide: getRepositoryToken(VolunteerProfile),
          useValue: mockProfileRepository,
        },
        {
          provide: getRepositoryToken(VolunteerEvent),
          useValue: mockEventRepository,
        },
      ],
    }).compile();

    service = module.get<VolunteersService>(VolunteersService);
    profileRepository = module.get(getRepositoryToken(VolunteerProfile));
    eventRepository = module.get(getRepositoryToken(VolunteerEvent));

    jest.clearAllMocks();
  });

  describe('createProfile', () => {
    const createDto = {
      skills: ['first-aid', 'cooking'],
    };

    it('should create volunteer profile successfully', async () => {
      mockProfileRepository.findOne.mockResolvedValue(null);
      mockProfileRepository.create.mockReturnValue(mockVolunteerProfile);
      mockProfileRepository.save.mockResolvedValue(mockVolunteerProfile);

      const result = await service.createProfile('user-id-123', createDto);

      expect(result).toEqual(mockVolunteerProfile);
    });

    it('should throw BadRequestException if profile already exists', async () => {
      mockProfileRepository.findOne.mockResolvedValue(mockVolunteerProfile);

      await expect(
        service.createProfile('user-id-123', createDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getProfile', () => {
    it('should return existing profile', async () => {
      mockProfileRepository.findOne.mockResolvedValue(mockVolunteerProfile);

      const result = await service.getProfile('user-id-123');

      expect(result).toEqual(mockVolunteerProfile);
    });

    it('should auto-create profile if not exists', async () => {
      mockProfileRepository.findOne
        .mockResolvedValueOnce(null) // First call - profile doesn't exist
        .mockResolvedValueOnce(mockVolunteerProfile); // After save - return created profile
      mockProfileRepository.create.mockReturnValue(mockVolunteerProfile);
      mockProfileRepository.save.mockResolvedValue(mockVolunteerProfile);

      const result = await service.getProfile('user-id-123');

      expect(result).toEqual(mockVolunteerProfile);
      expect(mockProfileRepository.create).toHaveBeenCalled();
    });
  });

  describe('updateProfile', () => {
    const updateDto = {
      skills: ['first-aid', 'driving', 'cooking'],
    };

    it('should update volunteer profile', async () => {
      mockProfileRepository.findOne.mockResolvedValue({ ...mockVolunteerProfile });
      mockProfileRepository.save.mockResolvedValue({
        ...mockVolunteerProfile,
        ...updateDto,
      });

      const result = await service.updateProfile('user-id-123', updateDto);

      expect(result.skills).toEqual(updateDto.skills);
    });
  });

  describe('logHours', () => {
    it('should log volunteer hours', async () => {
      mockProfileRepository.findOne.mockResolvedValue({ ...mockVolunteerProfile });
      mockProfileRepository.save.mockResolvedValue({
        ...mockVolunteerProfile,
        hoursLogged: 55,
      });

      const result = await service.logHours('user-id-123', { hours: 5 });

      expect(result.hoursLogged).toBe(55);
    });
  });

  describe('createEvent', () => {
    const createDto = {
      title: 'New Event',
      description: 'Description',
      location: 'Test Location',
      eventDate: new Date(),
      maxVolunteers: 10,
    };

    it('should create event without image', async () => {
      mockEventRepository.create.mockReturnValue(mockVolunteerEvent);
      mockEventRepository.save.mockResolvedValue(mockVolunteerEvent);

      const result = await service.createEvent('user-id-123', createDto);

      expect(result).toEqual(mockVolunteerEvent);
    });

    it('should create event with image', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        originalname: 'event.jpg',
      } as Express.Multer.File;

      (FileUploadUtil.uploadToCloudinary as jest.Mock).mockResolvedValue(
        'https://cloudinary.com/event.jpg',
      );
      mockEventRepository.create.mockReturnValue(mockVolunteerEvent);
      mockEventRepository.save.mockResolvedValue(mockVolunteerEvent);

      const result = await service.createEvent('user-id-123', createDto, mockFile);

      expect(FileUploadUtil.uploadToCloudinary).toHaveBeenCalled();
      expect(result).toEqual(mockVolunteerEvent);
    });
  });

  describe('updateEvent', () => {
    const updateDto = { title: 'Updated Event' };

    it('should update event by owner', async () => {
      mockEventRepository.findOne.mockResolvedValue({ ...mockVolunteerEvent });
      mockEventRepository.save.mockResolvedValue({
        ...mockVolunteerEvent,
        ...updateDto,
      });

      const result = await service.updateEvent(
        'event-id-123',
        'user-id-123',
        updateDto,
      );

      expect(result.title).toBe('Updated Event');
    });

    it('should throw ForbiddenException if not owner', async () => {
      mockEventRepository.findOne.mockResolvedValue(mockVolunteerEvent);

      await expect(
        service.updateEvent('event-id-123', 'other-user-id', updateDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAllEvents', () => {
    it('should return all events ordered by date', async () => {
      mockEventRepository.find.mockResolvedValue([mockVolunteerEvent]);

      const result = await service.findAllEvents();

      expect(result).toHaveLength(1);
      expect(mockEventRepository.find).toHaveBeenCalledWith({
        relations: ['volunteers', 'volunteers.user', 'createdBy'],
        order: { eventDate: 'ASC' },
      });
    });
  });

  describe('findEventsByUser', () => {
    it('should return events by user', async () => {
      mockEventRepository.find.mockResolvedValue([mockVolunteerEvent]);

      const result = await service.findEventsByUser('user-id-123');

      expect(result).toHaveLength(1);
    });
  });

  describe('findEvent', () => {
    it('should return event when found', async () => {
      mockEventRepository.findOne.mockResolvedValue(mockVolunteerEvent);

      const result = await service.findEvent('event-id-123');

      expect(result).toEqual(mockVolunteerEvent);
    });

    it('should throw NotFoundException when not found', async () => {
      mockEventRepository.findOne.mockResolvedValue(null);

      await expect(service.findEvent('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('signUpForEvent', () => {
    it('should sign up volunteer for event', async () => {
      const eventWithSpots = { ...mockVolunteerEvent, volunteers: [] };
      mockEventRepository.findOne.mockResolvedValue(eventWithSpots);
      mockProfileRepository.findOne.mockResolvedValue(mockVolunteerProfile);
      mockEventRepository.save.mockResolvedValue({
        ...eventWithSpots,
        volunteers: [mockVolunteerProfile],
      });

      const result = await service.signUpForEvent('event-id-123', 'user-id-123');

      expect(result.volunteers).toHaveLength(1);
    });

    it('should throw BadRequestException if already signed up', async () => {
      const eventWithVolunteer = {
        ...mockVolunteerEvent,
        volunteers: [mockVolunteerProfile],
      };
      mockEventRepository.findOne.mockResolvedValue(eventWithVolunteer);
      mockProfileRepository.findOne.mockResolvedValue(mockVolunteerProfile);

      await expect(
        service.signUpForEvent('event-id-123', 'user-id-123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if event is full', async () => {
      const fullEvent = {
        ...mockVolunteerEvent,
        maxVolunteers: 1,
        volunteers: [{ id: 'other-profile' }],
      };
      mockEventRepository.findOne.mockResolvedValue(fullEvent);
      mockProfileRepository.findOne.mockResolvedValue(mockVolunteerProfile);

      await expect(
        service.signUpForEvent('event-id-123', 'user-id-123'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('removeEvent', () => {
    it('should remove event by owner', async () => {
      mockEventRepository.findOne.mockResolvedValue(mockVolunteerEvent);
      mockEventRepository.remove.mockResolvedValue(mockVolunteerEvent);

      await expect(
        service.removeEvent('event-id-123', 'user-id-123'),
      ).resolves.not.toThrow();
    });

    it('should throw ForbiddenException if not owner', async () => {
      mockEventRepository.findOne.mockResolvedValue(mockVolunteerEvent);

      await expect(
        service.removeEvent('event-id-123', 'other-user-id'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
