import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @MinLength(16, { message: 'token is invalid' })
  @IsString()
  @IsNotEmpty({ message: 'token is required' })
  token: string;

  @MinLength(8, { message: 'password must be at least 8 characters' })
  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
