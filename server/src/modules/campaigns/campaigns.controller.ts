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
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CampaignsService } from './campaigns.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { FilterCampaignsDto } from './dto/filter-campaigns.dto';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  async findAll(@Query() filterDto: FilterCampaignsDto) {
    return this.campaignsService.findAll(filterDto);
  }

  @Get('my-campaigns')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.NGO, Role.ADMIN)
  async getMyCampaigns(@CurrentUser('id') userId: string) {
    return this.campaignsService.findByUserId(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.NGO, Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateCampaignDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.campaignsService.create(userId, createDto, file);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.NGO, Role.ADMIN)
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: Role,
    @Body() updateDto: UpdateCampaignDto,
  ) {
    return this.campaignsService.update(id, userId, userRole, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.NGO, Role.ADMIN)
  async remove(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: Role,
  ) {
    await this.campaignsService.remove(id, userId, userRole);
    return { message: 'Campaign deleted successfully' };
  }

  // Create emergency campaign from disaster alert
  @Post('emergency/auto-create')
  async createEmergencyCampaign(@Body() disasterData: any) {
    return this.campaignsService.createEmergencyCampaign(disasterData);
  }
}
