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
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { OffersService } from './offers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferStatusDto } from './dto/update-offer-status.dto';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  async findAll() {
    return this.offersService.findAll();
  }

  @Get('available')
  async findAvailable() {
    return this.offersService.findAvailable();
  }

  @Get('my-offers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DONOR)
  async getMyOffers(@CurrentUser('id') userId: string) {
    return this.offersService.findByDonor(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.offersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DONOR)
  @UseInterceptors(FilesInterceptor('images', 5))
  async create(
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateOfferDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.offersService.create(userId, createDto, files);
  }

  @Put(':id/claim')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.NGO)
  async claim(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: Role,
  ) {
    return this.offersService.claim(id, userId, userRole);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateStatus(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateOfferStatusDto,
  ) {
    return this.offersService.updateStatus(id, userId, dto.status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DONOR)
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    await this.offersService.remove(id, userId);
    return { message: 'Offer deleted successfully' };
  }
}
