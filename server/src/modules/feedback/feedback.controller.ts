import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Controller('feedback')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @Roles(Role.DONOR)
  async create(
    @CurrentUser('id') donorId: string,
    @Body() createDto: CreateFeedbackDto,
  ) {
    return this.feedbackService.create(donorId, createDto);
  }

  @Get('ngo/:id')
  async findByNgo(@Param('id') ngoId: string) {
    return this.feedbackService.findByNgo(ngoId);
  }

  @Get('ngo/:id/rating')
  async getAverageRating(@Param('id') ngoId: string) {
    const avgRating = await this.feedbackService.getAverageRating(ngoId);
    return { averageRating: avgRating };
  }

  @Get('my-feedback')
  @Roles(Role.DONOR)
  async findMyFeedback(@CurrentUser('id') donorId: string) {
    return this.feedbackService.findByDonor(donorId);
  }
}
