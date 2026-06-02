import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class VerifyEmailDto {
  @MinLength(16, { message: 'token is invalid' })
  @IsString()
  @IsNotEmpty({ message: 'token is required' })
  token: string;
}
