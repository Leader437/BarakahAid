import {
  Controller,
  Get,
  Put,
  Patch,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto';
import { UpdateVerificationStatusDto } from './dto/update-verification-status.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser('id') userId: string) {
    const user = await this.usersService.findById(userId);
    console.log('📤 Returning user profile:', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      profileImage: user.profileImage,
      role: user.role,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
    }, null, 2));
    return user;
  }

  @Put('profile')
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() updateDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, updateDto);
  }

  @Put('profile/image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImage(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadProfileImage(userId, file);
  }

  @Put('profile/notifications')
  async updateNotificationPreferences(
    @CurrentUser('id') userId: string,
    @Body() preferences: UpdateNotificationPreferencesDto,
  ) {
    return this.usersService.updateNotificationPreferences(userId, preferences);
  }

  @Patch('update-role')
  async updateRole(
    @CurrentUser('id') userId: string,
    @Body('role') role: Role,
  ) {
    console.log('📝 Update role request:', { userId, role });
    const result = await this.usersService.updateUserRole(userId, role);
    console.log('📤 Returning updated user:', { id: result.id, role: result.role, name: result.name });
    return result;
  }

  @Put('profile/verification/submit')
  @UseInterceptors(FilesInterceptor('documents', 5))
  async submitVerificationDocuments(
    @CurrentUser('id') userId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.usersService.submitVerificationDocuments(userId, files);
  }

  @Roles(Role.ADMIN)
  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Roles(Role.ADMIN)
  @Put(':id/verification')
  async updateVerificationStatus(
    @Param('id') userId: string,
    @Body() dto: UpdateVerificationStatusDto,
  ) {
    return this.usersService.updateVerificationStatus(userId, dto.status);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id') userId: string) {
    await this.usersService.deleteUser(userId);
    return { message: 'User deleted successfully' };
  }
}
