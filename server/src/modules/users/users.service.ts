import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { VerificationStatus } from '../../common/enums/status.enum';
import { FileUploadUtil } from '../../utils/file-upload.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, updateDto: UpdateProfileDto): Promise<User> {
    const user = await this.findById(userId);
    Object.assign(user, updateDto);
    return this.userRepository.save(user);
  }

  async uploadProfileImage(userId: string, file: Express.Multer.File): Promise<User> {
    const user = await this.findById(userId);
    
    if (user.profileImage) {
      await FileUploadUtil.deleteFromCloudinary(user.profileImage);
    }

    const imageUrl = await FileUploadUtil.uploadToCloudinary(file, 'profiles');
    user.profileImage = imageUrl;
    
    return this.userRepository.save(user);
  }

  async updateNotificationPreferences(
    userId: string,
    preferences: any,
  ): Promise<User> {
    const user = await this.findById(userId);
    user.notificationPreferences = { ...user.notificationPreferences, ...preferences };
    return this.userRepository.save(user);
  }

  async submitVerificationDocuments(
    userId: string,
    files: Express.Multer.File[],
  ): Promise<User> {
    const user = await this.findById(userId);
    
    if (user.verificationStatus === VerificationStatus.VERIFIED) {
      throw new BadRequestException('User is already verified');
    }

    const documentUrls = await FileUploadUtil.uploadMultipleToCloudinary(
      files,
      'verification-docs',
    );

    user.verificationDocuments = documentUrls;
    user.verificationStatus = VerificationStatus.PENDING;
    
    return this.userRepository.save(user);
  }

  async updateVerificationStatus(
    userId: string,
    status: VerificationStatus,
  ): Promise<User> {
    const user = await this.findById(userId);
    user.verificationStatus = status;
    return this.userRepository.save(user);
  }

  async findByRole(role: any): Promise<User | null> {
    return this.userRepository.findOne({ where: { role } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.findById(userId);
    await this.userRepository.remove(user);
  }

  async updateUserRole(userId: string, role: any): Promise<User> {
    const user = await this.findById(userId);
    user.role = role;
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }
}
