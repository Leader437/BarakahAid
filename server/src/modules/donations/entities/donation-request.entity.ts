import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { DonationCategory } from '../../categories/entities/donation-category.entity';
import { DonationRequestStatus } from '../../../common/enums/status.enum';

@Entity('donation_requests')
export class DonationRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => DonationCategory, (category) => category.donationRequests)
  @JoinColumn()
  category: DonationCategory;

  @Column({ type: 'jsonb', nullable: true })
  media: string[];

  @Column({ type: 'jsonb', nullable: true })
  location: {
    type: string;
    coordinates: [number, number];
    address?: string;
  };

  @ManyToOne(() => User, (user) => user.donationRequests)
  @JoinColumn()
  createdBy: User;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  targetAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentAmount: number;

  @Column({ type: 'varchar', default: 'MEDIUM' })
  urgency: string;

  @Column({
    type: 'enum',
    enum: DonationRequestStatus,
    default: DonationRequestStatus.PENDING,
  })
  status: DonationRequestStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
