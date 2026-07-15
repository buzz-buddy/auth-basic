import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleSignInDto {
  @IsString()
  @IsNotEmpty({ message: 'idToken is required' })
  idToken: string;
}
