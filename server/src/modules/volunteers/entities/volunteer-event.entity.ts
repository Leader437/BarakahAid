import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { VolunteerProfile } from './volunteer-profile.entity';

@Entity('volunteer_events')
export class VolunteerEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  location: {
    address: string;
    coordinates?: [number, number];
  };

  @Column({ type: 'timestamp' })
  eventDate: Date;

  @Column({ type: 'jsonb', default: [] })
  requiredSkills: string[];

  @Column({ type: 'int', default: 0 })
  maxVolunteers: number;

  @ManyToMany(() => VolunteerProfile, (profile) => profile.events)
  @JoinTable()
  volunteers: VolunteerProfile[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
