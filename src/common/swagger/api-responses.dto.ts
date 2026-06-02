import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FieldErrorsDto {
  @ApiProperty({
    example: { email: ['email is required'], password: ['password is required'] },
    additionalProperties: { type: 'array', items: { type: 'string' } },
  })
  errors: Record<string, string[]>;
}

export class ValidationErrorResponseDto extends FieldErrorsDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Validation failed' })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

export class AccessTokenResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Operation successful' })
  message: string;
}

export class LogoutResponseDto {
  @ApiProperty({ example: true })
  success: boolean;
}

export class UserPublicDto {
  @ApiProperty({ example: 'clxyz123' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'USER', enum: ['USER', 'ADMIN'] })
  role: string;

  @ApiPropertyOptional({ example: 'Jane' })
  firstName: string | null;

  @ApiPropertyOptional({ example: 'Doe' })
  lastName: string | null;

  @ApiPropertyOptional({ example: 'jane_d' })
  displayName: string | null;

  @ApiPropertyOptional({
    description: 'Presigned S3 URL (expires; refresh profile to renew)',
  })
  avatarUrl: string | null;

  @ApiPropertyOptional({ example: '1990-05-15' })
  dateOfBirth: string | null;

  @ApiProperty({ example: 'ACTIVE' })
  status: string;

  @ApiProperty({ example: false })
  emailVerified: boolean;

  @ApiPropertyOptional()
  emailVerifiedAt: string | null;

  @ApiPropertyOptional()
  lastLoginAt: string | null;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class RegisterResponseDto extends AccessTokenResponseDto {
  @ApiProperty({ example: 'Registration successful. Check your email for a verification link.' })
  message: string;

  @ApiProperty({ type: UserPublicDto })
  user: UserPublicDto;
}
