import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role, UserStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { UserProfileFieldsDto } from '../../users/dto/user-profile-fields.dto';

export class UpdateAdminUserDto extends UserProfileFieldsDto {
  @ApiPropertyOptional({ enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
