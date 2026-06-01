import { IsDateString, IsOptional, IsString } from 'class-validator';

/**
 * Optional user profile fields. Shared by register (signup) and PATCH /users/me.
 * Add new profile columns here once; both endpoints pick them up.
 */
export class UserProfileFieldsDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}
