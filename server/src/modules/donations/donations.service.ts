import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DonationRequest } from './entities/donation-request.entity';
import { CreateDonationRequestDto } from './dto/create-donation-request.dto';
import { UpdateDonationRequestDto } from './dto/update-donation-request.dto';
import { FilterDonationRequestsDto } from './dto/filter-donation-requests.dto';
import { FileUploadUtil } from '../../utils/file-upload.util';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(DonationRequest)
    private readonly donationRequestRepository: Repository<DonationRequest>,
  ) {}

  async create(
    userId: string,
    createDto: CreateDonationRequestDto,
    files?: Express.Multer.File[],
  ): Promise<DonationRequest> {
    let mediaUrls: string[] = [];

    if (files && files.length > 0) {
      mediaUrls = await FileUploadUtil.uploadMultipleToCloudinary(
        files,
        'donation-requests',
      );
    }

    const donationRequest = this.donationRequestRepository.create({
      ...createDto,
      media: mediaUrls,
      createdBy: { id: userId } as any,
      category: { id: createDto.categoryId } as any,
    });

    return this.donationRequestRepository.save(donationRequest);
  }

  async findAll(filterDto?: FilterDonationRequestsDto): Promise<DonationRequest[]> {
    const query = this.donationRequestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.category', 'category')
      .leftJoinAndSelect('request.createdBy', 'createdBy');

    if (filterDto?.categoryId) {
      query.andWhere('category.id = :categoryId', {
        categoryId: filterDto.categoryId,
      });
    }

    if (filterDto?.status) {
      query.andWhere('request.status = :status', { status: filterDto.status });
    }

    if (filterDto?.search) {
      query.andWhere(
        '(request.title ILIKE :search OR request.description ILIKE :search)',
        { search: `%${filterDto.search}%` },
      );
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<DonationRequest> {
    const request = await this.donationRequestRepository.findOne({
      where: { id },
      relations: ['category', 'createdBy'],
    });

    if (!request) {
      throw new NotFoundException('Donation request not found');
    }

    return request;
  }

  async update(
    id: string,
    userId: string,
    userRole: Role,
    updateDto: UpdateDonationRequestDto,
  ): Promise<DonationRequest> {
    const request = await this.findOne(id);

    if (request.createdBy.id !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You can only update your own requests');
    }

    Object.assign(request, updateDto);
    return this.donationRequestRepository.save(request);
  }

  async remove(id: string, userId: string, userRole: Role): Promise<void> {
    const request = await this.findOne(id);

    if (request.createdBy.id !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You can only delete your own requests');
    }

    await this.donationRequestRepository.remove(request);
  }

  async findByUserId(userId: string): Promise<DonationRequest[]> {
    return this.donationRequestRepository.find({
      where: { createdBy: { id: userId } },
      relations: ['category'],
    });
  }
}
