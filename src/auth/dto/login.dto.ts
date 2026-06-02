import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'email must be a valid email address' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @MinLength(8, { message: 'password must be at least 8 characters' })
  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
