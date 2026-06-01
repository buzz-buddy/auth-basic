import { IsEmail, IsString, MinLength } from 'class-validator';
import { UserProfileFieldsDto } from '../../users/dto/user-profile-fields.dto';

/**
 * Signup: email and password are required; all profile fields are optional
 * (same set as PATCH /users/me).
 */
export class RegisterDto extends UserProfileFieldsDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
