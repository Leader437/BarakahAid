import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VolunteersController } from './volunteers.controller';
import { VolunteersService } from './volunteers.service';
import { VolunteerProfile } from './entities/volunteer-profile.entity';
import { VolunteerEvent } from './entities/volunteer-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VolunteerProfile, VolunteerEvent])],
  controllers: [VolunteersController],
  providers: [VolunteersService],
  exports: [VolunteersService],
})
export class VolunteersModule {}
