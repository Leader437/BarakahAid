import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DonationsService } from './donations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CreateDonationRequestDto } from './dto/create-donation-request.dto';
import { UpdateDonationRequestDto } from './dto/update-donation-request.dto';
import { FilterDonationRequestsDto } from './dto/filter-donation-requests.dto';

@Controller('donation-requests')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Get()
  async findAll(@Query() filterDto: FilterDonationRequestsDto) {
    return this.donationsService.findAll(filterDto);
  }

  @Get('my-requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.NGO)
  async getMyRequests(@CurrentUser('id') userId: string) {
    return this.donationsService.findByUserId(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.donationsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.NGO)
  @UseInterceptors(FilesInterceptor('media', 5))
  async create(
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateDonationRequestDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.donationsService.create(userId, createDto, files);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.NGO, Role.ADMIN)
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: Role,
    @Body() updateDto: UpdateDonationRequestDto,
  ) {
    return this.donationsService.update(id, userId, userRole, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.NGO, Role.ADMIN)
  async remove(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: Role,
  ) {
    await this.donationsService.remove(id, userId, userRole);
    return { message: 'Donation request deleted successfully' };
  }
}
