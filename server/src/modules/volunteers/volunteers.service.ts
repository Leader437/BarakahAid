import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VolunteerProfile } from './entities/volunteer-profile.entity';
import { VolunteerEvent } from './entities/volunteer-event.entity';
import { CreateVolunteerProfileDto } from './dto/create-volunteer-profile.dto';
import { UpdateVolunteerProfileDto } from './dto/update-volunteer-profile.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { LogHoursDto } from './dto/log-hours.dto';
import { FileUploadUtil } from '../../utils/file-upload.util';

@Injectable()
export class VolunteersService {
  constructor(
    @InjectRepository(VolunteerProfile)
    private readonly profileRepository: Repository<VolunteerProfile>,
    @InjectRepository(VolunteerEvent)
    private readonly eventRepository: Repository<VolunteerEvent>,
  ) {}

  async createProfile(
    userId: string,
    createDto: CreateVolunteerProfileDto,
  ): Promise<VolunteerProfile> {
    const existing = await this.profileRepository.findOne({
      where: { user: { id: userId } },
    });

    if (existing) {
      throw new BadRequestException('Volunteer profile already exists');
    }

    const profile = this.profileRepository.create({
      ...createDto,
      user: { id: userId } as any,
    });

    return this.profileRepository.save(profile);
  }

  async getProfile(userId: string): Promise<VolunteerProfile> {
    const existing = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['events'],
    });

    if (existing) {
      return existing;
    }

    // Auto-create basic profile if it doesn't exist
    const newProfile = this.profileRepository.create({
      skills: [],
      user: { id: userId } as any,
    });
    const savedProfile = await this.profileRepository.save(newProfile);
    
    // Load relations for consistency
    const reloaded = await this.profileRepository.findOne({
      where: { id: savedProfile.id },
      relations: ['events'],
    });

    if (!reloaded) {
       throw new Error('Failed to create/reload volunteer profile');
    }

    return reloaded;
  }

  async updateProfile(
    userId: string,
    updateDto: UpdateVolunteerProfileDto,
  ): Promise<VolunteerProfile> {
    const profile = await this.getProfile(userId);
    Object.assign(profile, updateDto);
    return this.profileRepository.save(profile);
  }

  async logHours(userId: string, logDto: LogHoursDto): Promise<VolunteerProfile> {
    const profile = await this.getProfile(userId);
    profile.hoursLogged += logDto.hours;
    return this.profileRepository.save(profile);
  }

  async createEvent(
    userId: string, 
    createDto: CreateEventDto, 
    file?: Express.Multer.File
  ): Promise<VolunteerEvent> {
    let imageUrl: string | null = null;

    if (file) {
      imageUrl = await FileUploadUtil.uploadToCloudinary(file, 'events');
    }

    const event = this.eventRepository.create({
      ...createDto,
      image: imageUrl,
      createdBy: { id: userId } as any,
    });
    return this.eventRepository.save(event);
  }

  async updateEvent(
    id: string, 
    userId: string, 
    updateDto: UpdateEventDto,
    file?: Express.Multer.File
  ): Promise<VolunteerEvent> {
    const event = await this.findEvent(id);
    
    // Check ownership
    if (event.createdBy?.id !== userId) {
      throw new ForbiddenException('You can only update your own events');
    }

    if (file) {
      const imageUrl = await FileUploadUtil.uploadToCloudinary(file, 'events');
      event.image = imageUrl;
    }

    Object.assign(event, updateDto);
    return this.eventRepository.save(event);
  }

  async findAllEvents(): Promise<VolunteerEvent[]> {
    return this.eventRepository.find({
      relations: ['volunteers', 'volunteers.user', 'createdBy'],
      order: { eventDate: 'ASC' },
    });
  }

  async findEventsByUser(userId: string): Promise<VolunteerEvent[]> {
    return this.eventRepository.find({
      where: { createdBy: { id: userId } },
      relations: ['volunteers', 'volunteers.user'],
      order: { eventDate: 'ASC' },
    });
  }

  async findEvent(id: string): Promise<VolunteerEvent> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['volunteers', 'volunteers.user', 'createdBy'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async signUpForEvent(eventId: string, userId: string): Promise<VolunteerEvent> {
    const event = await this.findEvent(eventId);
    const profile = await this.getProfile(userId);

    if (event.volunteers.some((v) => v.id === profile.id)) {
      throw new BadRequestException('Already signed up for this event');
    }

    if (event.volunteers.length >= event.maxVolunteers) {
      throw new BadRequestException('Event is full');
    }

    event.volunteers.push(profile);
    return this.eventRepository.save(event);
  }

  async removeEvent(id: string, userId: string): Promise<void> {
    const event = await this.findEvent(id);
    
    // Check ownership
    if (event.createdBy?.id !== userId) {
      throw new ForbiddenException('You can only delete your own events');
    }

    await this.eventRepository.remove(event);
  }
}
