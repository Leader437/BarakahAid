import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  async create(donorId: string, createDto: CreateFeedbackDto): Promise<Feedback> {
    const feedback = this.feedbackRepository.create({
      ...createDto,
      donor: { id: donorId } as any,
      ngo: { id: createDto.ngoId } as any,
    });

    return this.feedbackRepository.save(feedback);
  }

  async findByNgo(ngoId: string): Promise<Feedback[]> {
    return this.feedbackRepository.find({
      where: { ngo: { id: ngoId } },
      relations: ['donor'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByDonor(donorId: string): Promise<Feedback[]> {
    return this.feedbackRepository.find({
      where: { donor: { id: donorId } },
      relations: ['ngo'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAverageRating(ngoId: string): Promise<number> {
    const result = await this.feedbackRepository
      .createQueryBuilder('feedback')
      .select('AVG(feedback.rating)', 'avg')
      .where('feedback.ngoId = :ngoId', { ngoId })
      .getRawOne();

    return result?.avg ? parseFloat(result.avg) : 0;
  }
}
