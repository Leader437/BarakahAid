import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum UserStatusAction {
  VERIFY = 'VERIFY',
  REJECT = 'REJECT',
  BLOCK = 'BLOCK',
  UNBLOCK = 'UNBLOCK',
}

export class UpdateUserStatusDto {
  @IsEnum(UserStatusAction)
  @IsNotEmpty()
  action: UserStatusAction;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class UpdateUserVerificationDto {
  @IsEnum(['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'])
  @IsNotEmpty()
  status: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateUserRoleDto {
  @IsEnum(['DONOR', 'NGO', 'VOLUNTEER', 'ADMIN', 'RECIPIENT'])
  @IsNotEmpty()
  role: string;
}
