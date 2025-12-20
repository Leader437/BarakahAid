import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { VolunteersService } from './volunteers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CreateVolunteerProfileDto } from './dto/create-volunteer-profile.dto';
import { UpdateVolunteerProfileDto } from './dto/update-volunteer-profile.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { LogHoursDto } from './dto/log-hours.dto';

@Controller('volunteers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VolunteersController {
  constructor(private readonly volunteersService: VolunteersService) {}

  @Post('profile')
  @Roles(Role.VOLUNTEER)
  async createProfile(
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateVolunteerProfileDto,
  ) {
    return this.volunteersService.createProfile(userId, createDto);
  }

  @Get('profile')
  @Roles(Role.VOLUNTEER)
  async getProfile(@CurrentUser('id') userId: string) {
    return this.volunteersService.getProfile(userId);
  }

  @Put('profile')
  @Roles(Role.VOLUNTEER)
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() updateDto: UpdateVolunteerProfileDto,
  ) {
    return this.volunteersService.updateProfile(userId, updateDto);
  }

  @Post('hours')
  @Roles(Role.VOLUNTEER)
  async logHours(@CurrentUser('id') userId: string, @Body() logDto: LogHoursDto) {
    return this.volunteersService.logHours(userId, logDto);
  }

  @Get('events')
  async findAllEvents() {
    return this.volunteersService.findAllEvents();
  }

  @Get('events/:id')
  async findEvent(@Param('id') id: string) {
    return this.volunteersService.findEvent(id);
  }

  @Post('events')
  @Roles(Role.NGO, Role.ADMIN)
  async createEvent(@Body() createDto: CreateEventDto) {
    return this.volunteersService.createEvent(createDto);
  }

  @Post('events/:id/signup')
  @Roles(Role.VOLUNTEER)
  async signUpForEvent(
    @Param('id') eventId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.volunteersService.signUpForEvent(eventId, userId);
  }

  @Delete('events/:id')
  @Roles(Role.NGO, Role.ADMIN)
  async removeEvent(@Param('id') id: string) {
    await this.volunteersService.removeEvent(id);
    return { message: 'Event deleted successfully' };
  }
}
