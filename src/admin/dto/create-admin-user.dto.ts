import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserProfileFieldsDto } from '../../users/dto/user-profile-fields.dto';

export class CreateAdminUserDto extends UserProfileFieldsDto {
  @ApiProperty({ example: 'customer@example.com' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @ApiProperty({ example: 'securePass123', minLength: 8 })
  @MinLength(8, { message: 'password must be at least 8 characters' })
  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.USER })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description:
      'When true, user can sign in immediately. When false, a verification email is sent.',
  })
  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;
}
