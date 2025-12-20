import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from './entities/campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { FilterCampaignsDto } from './dto/filter-campaigns.dto';
import { FileUploadUtil } from '../../utils/file-upload.util';
import { Role } from '../../common/enums/role.enum';
import { CampaignStatus } from '../../common/enums/status.enum';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  async create(
    userId: string,
    createDto: CreateCampaignDto,
    file?: Express.Multer.File,
  ): Promise<Campaign> {
    let imageUrl: string | null = null;

    if (file) {
      imageUrl = await FileUploadUtil.uploadToCloudinary(file, 'campaigns');
    }

    const campaign = this.campaignRepository.create({
      ...createDto,
      image: imageUrl,
      createdBy: { id: userId } as any,
    });

    return this.campaignRepository.save(campaign);
  }

  async findAll(filterDto?: FilterCampaignsDto): Promise<Campaign[]> {
    const query = this.campaignRepository
      .createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.createdBy', 'createdBy');

    if (filterDto?.status) {
      query.andWhere('campaign.status = :status', { status: filterDto.status });
    }

    if (filterDto?.isEmergency !== undefined) {
      query.andWhere('campaign.isEmergency = :isEmergency', {
        isEmergency: filterDto.isEmergency,
      });
    }

    if (filterDto?.search) {
      query.andWhere(
        '(campaign.title ILIKE :search OR campaign.description ILIKE :search)',
        { search: `%${filterDto.search}%` },
      );
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne({
      where: { id },
      relations: ['createdBy', 'transactions'],
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return campaign;
  }

  async update(
    id: string,
    userId: string,
    userRole: Role,
    updateDto: UpdateCampaignDto,
  ): Promise<Campaign> {
    const campaign = await this.findOne(id);

    if (campaign.createdBy.id !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You can only update your own campaigns');
    }

    Object.assign(campaign, updateDto);
    return this.campaignRepository.save(campaign);
  }

  async remove(id: string, userId: string, userRole: Role): Promise<void> {
    const campaign = await this.findOne(id);

    if (campaign.createdBy.id !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You can only delete your own campaigns');
    }

    await this.campaignRepository.remove(campaign);
  }

  async findByUserId(userId: string): Promise<Campaign[]> {
    return this.campaignRepository.find({
      where: { createdBy: { id: userId } },
    });
  }

  async updateRaisedAmount(campaignId: string, amount: number): Promise<void> {
    const campaign = await this.findOne(campaignId);
    campaign.raisedAmount = Number(campaign.raisedAmount) + amount;

    if (campaign.raisedAmount >= campaign.goalAmount) {
      campaign.status = CampaignStatus.COMPLETED;
    }

    await this.campaignRepository.save(campaign);
  }
}
