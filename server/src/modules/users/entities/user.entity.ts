import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Role } from '../../../common/enums/role.enum';
import { VerificationStatus } from '../../../common/enums/status.enum';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { DonationRequest } from '../../donations/entities/donation-request.entity';
import { Campaign } from '../../campaigns/entities/campaign.entity';
import { DonationOffer } from '../../offers/entities/donation-offer.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { VolunteerProfile } from '../../volunteers/entities/volunteer-profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.DONOR,
  })
  role: Role;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.UNVERIFIED,
  })
  verificationStatus: VerificationStatus;

  @Column({ type: 'jsonb', nullable: true })
  verificationDocuments: string[];

  @Column({ type: 'jsonb', default: {} })
  notificationPreferences: {
    email?: boolean;
    push?: boolean;
    donations?: boolean;
    campaigns?: boolean;
    emergency?: boolean;
  };

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordExpiry: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.donor)
  donations: Transaction[];

  @OneToMany(() => DonationRequest, (request) => request.createdBy)
  donationRequests: DonationRequest[];

  @OneToMany(() => Campaign, (campaign) => campaign.createdBy)
  campaigns: Campaign[];

  @OneToMany(() => DonationOffer, (offer) => offer.donor)
  donationOffers: DonationOffer[];

  @OneToMany(() => Feedback, (feedback) => feedback.donor)
  feedbackGiven: Feedback[];

  @OneToMany(() => Feedback, (feedback) => feedback.ngo)
  feedbackReceived: Feedback[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToOne(() => VolunteerProfile, (profile) => profile.user)
  volunteerProfile: VolunteerProfile;
}
