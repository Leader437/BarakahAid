import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { VolunteerEvent } from './volunteer-event.entity';

@Entity('volunteer_profiles')
export class VolunteerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.volunteerProfile)
  @JoinColumn()
  user: User;

  @Column({ type: 'jsonb', default: [] })
  skills: string[];

  @Column({ type: 'text', nullable: true })
  availability: string;

  @Column({ type: 'int', default: 0 })
  hoursLogged: number;

  @ManyToMany(() => VolunteerEvent, (event) => event.volunteers)
  events: VolunteerEvent[];

  @CreateDateColumn()
  createdAt: Date;
}
