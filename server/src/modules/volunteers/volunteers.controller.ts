import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VolunteersService } from './volunteers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CreateVolunteerProfileDto } from './dto/create-volunteer-profile.dto';
import { UpdateVolunteerProfileDto } from './dto/update-volunteer-profile.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { LogHoursDto } from './dto/log-hours.dto';

@Controller('volunteers')
export class VolunteersController {
  constructor(private readonly volunteersService: VolunteersService) {}

  @Post('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VOLUNTEER)
  async createProfile(
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateVolunteerProfileDto,
  ) {
    return this.volunteersService.createProfile(userId, createDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VOLUNTEER)
  async getProfile(@CurrentUser('id') userId: string) {
    return this.volunteersService.getProfile(userId);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VOLUNTEER)
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() updateDto: UpdateVolunteerProfileDto,
  ) {
    return this.volunteersService.updateProfile(userId, updateDto);
  }

  @Post('hours')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VOLUNTEER)
  async logHours(@CurrentUser('id') userId: string, @Body() logDto: LogHoursDto) {
    return this.volunteersService.logHours(userId, logDto);
  }

  // Public events list - accessible to any authenticated user
  @Get('events')
  @UseGuards(JwtAuthGuard)
  async findAllEvents() {
    return this.volunteersService.findAllEvents();
  }

  // NGO's own events
  @Get('events/my-events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.NGO)
  async findMyEvents(@CurrentUser('id') userId: string) {
    return this.volunteersService.findEventsByUser(userId);
  }

  @Get('events/:id')
  @UseGuards(JwtAuthGuard)
  async findEvent(@Param('id') id: string) {
    return this.volunteersService.findEvent(id);
  }

  // Only NGOs can create events
  @Post('events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.NGO)
  @UseInterceptors(FileInterceptor('image'))
  async createEvent(
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateEventDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.volunteersService.createEvent(userId, createDto, file);
  }

  // Only NGOs can update their own events
  @Put('events/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.NGO)
  @UseInterceptors(FileInterceptor('image'))
  async updateEvent(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() updateDto: UpdateEventDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.volunteersService.updateEvent(id, userId, updateDto, file);
  }

  @Post('events/:id/signup')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VOLUNTEER)
  async signUpForEvent(
    @Param('id') eventId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.volunteersService.signUpForEvent(eventId, userId);
  }

  // Only NGOs can delete their own events
  @Delete('events/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.NGO)
  async removeEvent(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    await this.volunteersService.removeEvent(id, userId);
    return { message: 'Event deleted successfully' };
  }
}
