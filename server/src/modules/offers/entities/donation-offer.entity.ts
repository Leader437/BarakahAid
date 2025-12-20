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
import { DonationOfferStatus } from '../../../common/enums/status.enum';

@Entity('donation_offers')
export class DonationOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemName: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  images: string[];

  @ManyToOne(() => User, (user) => user.donationOffers)
  @JoinColumn()
  donor: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  claimedBy: User;

  @Column({
    type: 'enum',
    enum: DonationOfferStatus,
    default: DonationOfferStatus.AVAILABLE,
  })
  status: DonationOfferStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
