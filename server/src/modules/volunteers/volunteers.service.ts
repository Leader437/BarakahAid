import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VolunteerProfile } from './entities/volunteer-profile.entity';
import { VolunteerEvent } from './entities/volunteer-event.entity';
import { CreateVolunteerProfileDto } from './dto/create-volunteer-profile.dto';
import { UpdateVolunteerProfileDto } from './dto/update-volunteer-profile.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { LogHoursDto } from './dto/log-hours.dto';

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

  async createEvent(createDto: CreateEventDto): Promise<VolunteerEvent> {
    const event = this.eventRepository.create(createDto);
    return this.eventRepository.save(event);
  }

  async findAllEvents(): Promise<VolunteerEvent[]> {
    return this.eventRepository.find({
      relations: ['volunteers', 'volunteers.user'],
      order: { eventDate: 'ASC' },
    });
  }

  async findEvent(id: string): Promise<VolunteerEvent> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['volunteers', 'volunteers.user'],
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

  async removeEvent(id: string): Promise<void> {
    const event = await this.findEvent(id);
    await this.eventRepository.remove(event);
  }
}
