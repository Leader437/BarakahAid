import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DonationOffer } from './entities/donation-offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { DonationOfferStatus } from '../../common/enums/status.enum';
import { FileUploadUtil } from '../../utils/file-upload.util';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(DonationOffer)
    private readonly offerRepository: Repository<DonationOffer>,
  ) {}

  async create(
    userId: string,
    createDto: CreateOfferDto,
    files?: Express.Multer.File[],
  ): Promise<DonationOffer> {
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      imageUrls = await FileUploadUtil.uploadMultipleToCloudinary(files, 'offers');
    }

    const offer = this.offerRepository.create({
      ...createDto,
      images: imageUrls,
      donor: { id: userId } as any,
    });

    return this.offerRepository.save(offer);
  }

  async findAll(): Promise<DonationOffer[]> {
    return this.offerRepository.find({
      relations: ['donor'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAvailable(): Promise<DonationOffer[]> {
    return this.offerRepository.find({
      where: { status: DonationOfferStatus.AVAILABLE },
      relations: ['donor'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<DonationOffer> {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: ['donor', 'claimedBy'],
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return offer;
  }

  async claim(id: string, userId: string, userRole: Role): Promise<DonationOffer> {
    const offer = await this.findOne(id);

    if (offer.status !== DonationOfferStatus.AVAILABLE) {
      throw new BadRequestException('Offer is not available');
    }

    if (userRole !== Role.NGO) {
      throw new ForbiddenException('Only NGOs can claim offers');
    }

    offer.status = DonationOfferStatus.CLAIMED;
    offer.claimedBy = { id: userId } as any;

    return this.offerRepository.save(offer);
  }

  async updateStatus(
    id: string,
    userId: string,
    status: DonationOfferStatus,
  ): Promise<DonationOffer> {
    const offer = await this.findOne(id);

    if (offer.donor.id !== userId && offer.claimedBy?.id !== userId) {
      throw new ForbiddenException('You can only update offers you created or claimed');
    }

    offer.status = status;
    return this.offerRepository.save(offer);
  }

  async findByDonor(donorId: string): Promise<DonationOffer[]> {
    return this.offerRepository.find({
      where: { donor: { id: donorId } },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    const offer = await this.findOne(id);

    if (offer.donor.id !== userId) {
      throw new ForbiddenException('You can only delete your own offers');
    }

    await this.offerRepository.remove(offer);
  }
}
