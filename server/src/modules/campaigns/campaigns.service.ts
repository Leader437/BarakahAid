import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from './entities/campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { FilterCampaignsDto } from './dto/filter-campaigns.dto';
import { User } from '../../modules/users/entities/user.entity';
import { FileUploadUtil } from '../../utils/file-upload.util';
import { Role } from '../../common/enums/role.enum';
import { CampaignStatus, VerificationStatus } from '../../common/enums/status.enum';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  // Auto-create emergency campaign from disaster alert
  async createEmergencyCampaign(disasterData: any): Promise<Campaign> {
    // Get or create system user for emergency campaigns
    let systemUser = await this.userRepository.findOne({
      where: { email: 'system@barakahaid.org' },
    });

    if (!systemUser) {
      // Create system user if it doesn't exist
      const userData = {
        email: 'system@barakahaid.org',
        name: 'BarakahAid System',
        password: 'system-auto-generated',
        role: Role.ADMIN,
        verificationStatus: VerificationStatus.VERIFIED,
      };
      systemUser = this.userRepository.create(userData);
      systemUser = await this.userRepository.save(systemUser);
    }

    // Create campaign description based on disaster details
    const disasterType = disasterData.type || 'Disaster';
    const location = disasterData.location || 'Affected Region';
    const severity = disasterData.severity || 'Major';
    
    const description = `
URGENT APPEAL - ${severity} ${disasterType} in ${location}

${disasterData.description || 'A major disaster has occurred and affected communities need immediate assistance.'}

We are launching an emergency relief campaign to provide:
• Emergency food and water supplies
• Medical aid and emergency healthcare
• Temporary shelter and relief materials
• Mental health support for affected families

Your donation will directly help save lives and provide relief to affected families. Every contribution counts!

Reported: ${new Date(disasterData.timestamp).toLocaleString()}
`;

    const goalAmount = this.getTargetAmount(disasterData.severity);
    const startDate = new Date();
    const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days

    const campaignData = {
      title: `Emergency Relief: ${disasterType} in ${location}`,
      description: description,
      image: this.getDisasterImage(disasterData.type),
      goalAmount: goalAmount,
      raisedAmount: 0,
      isEmergency: true,
      status: CampaignStatus.ACTIVE,
      startDate: startDate,
      endDate: endDate,
      createdBy: systemUser,
    };

    const saved = await this.campaignRepository.save(
      this.campaignRepository.create(campaignData)
    );
    
    // Return with metadata
    return {
      ...saved,
      metadata: {
        disasterType: disasterData.type,
        disasterId: disasterData.id,
        location: disasterData.location,
        severity: disasterData.severity,
        coordinates: disasterData.coordinates,
      },
    } as any;
  }

  private getDisasterImage(disasterType: string): string {
    const imageMap: { [key: string]: string } = {
      EARTHQUAKE: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=800',
      FLOOD: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      CYCLONE: 'https://images.unsplash.com/photo-1534274988757-a28bf1cf97d2?w=800',
      TSUNAMI: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      HEATWAVE: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800',
      DROUGHT: 'https://images.unsplash.com/photo-1552592081-6248e2b93382?w=800',
      LANDSLIDE: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    };

    return imageMap[disasterType] || 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800';
  }

  private getTargetAmount(severity: string): number {
    const amountMap: { [key: string]: number } = {
      CRITICAL: 1000000,
      HIGH: 500000,
      MEDIUM: 250000,
      LOW: 100000,
    };

    return amountMap[severity] || 500000;
  }
}
