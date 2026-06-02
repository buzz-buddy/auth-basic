import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserProfileFieldsDto } from '../../users/dto/user-profile-fields.dto';

/**
 * Signup: email and password are required; all profile fields are optional
 * (same set as PATCH /users/me).
 *
 * @IsNotEmpty is closest to the property so it runs before format validators.
 */
export class RegisterDto extends UserProfileFieldsDto {
  @IsEmail({}, { message: 'email must be a valid email address' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @MinLength(8, { message: 'password must be at least 8 characters' })
  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
