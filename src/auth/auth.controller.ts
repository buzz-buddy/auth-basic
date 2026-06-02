import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import {
  AccessTokenResponseDto,
  LogoutResponseDto,
  MessageResponseDto,
  RegisterResponseDto,
  UnauthorizedResponseDto,
  ValidationErrorResponseDto,
} from '../common/swagger/api-responses.dto';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { RefreshTokenCookieService } from './refresh-token-cookie.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private refreshCookie: RefreshTokenCookieService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Register a new account',
    description:
      'Creates a user, sends a verification email, returns `accessToken`, and a user object and sets the refresh token cookie.',
  })
  @ApiCookieAuth('refresh-cookie')
  @ApiResponse({ status: 201, type: RegisterResponseDto })
  @ApiResponse({ status: 400, type: ValidationErrorResponseDto })
  @ApiResponse({
    status: 409,
    description: 'Email already registered',
    schema: {
      example: {
        statusCode: 409,
        message: 'Registration failed',
        error: 'Conflict',
        errors: { email: ['Email already registered'] },
      },
    },
  })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto);
    this.refreshCookie.set(res, result.refreshToken);
    const { refreshToken: _refresh, ...body } = result;
    return body;
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify email with token from link',
    description: 'Token comes from the `?token=` query param in the verification email.',
  })
  @ApiCookieAuth('refresh-cookie')
  @ApiResponse({ status: 200, type: AccessTokenResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Missing token in request body',
    schema: {
      example: {
        errors: {
          token: ['token is required'],
        },
        statusCode: 400,
        message: 'Validation failed',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired verification token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid or expired verification token',
        error: 'Unauthorized',
      },
    },
  })
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.verifyEmail(dto);
    this.refreshCookie.set(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend email verification link' })
  @ApiResponse({ status: 200, schema: { example: { message: 'If the account exists and is unverified, a new verification email has been sent.' } } })
  @ApiResponse({ status: 400, schema: { example: { errors: { email: ['email is required'] }, statusCode: 400, message: 'Validation failed', error: 'Bad Request' } } })
  resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerification(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Log in',
    description: 'Returns `accessToken` with user object and sets the refresh token httpOnly cookie.',
  })
  @ApiCookieAuth('refresh-cookie')
  @ApiResponse({ status: 200, type: AccessTokenResponseDto })
  @ApiResponse({ status: 400, type: ValidationErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials', schema: { example: { statusCode: 401, message: 'Invalid credentials', error: 'Unauthorized' } } })
  @ApiResponse({ status: 403, description: 'Account suspended', schema: { example: { statusCode: 403, message: 'Account suspended', error: 'Forbidden' } } })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(dto);
    this.refreshCookie.set(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Requires the refresh token cookie. No request body. Returns a new `accessToken` and rotates the cookie.',
  })
  @ApiCookieAuth('refresh-cookie')
  @ApiResponse({ status: 200, type: AccessTokenResponseDto })
  @ApiResponse({ status: 401, description: 'Refresh token missing or invalid', schema: { example: { statusCode: 401, message: 'Refresh token missing', error: 'Unauthorized' } } })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = this.refreshCookie.read(req);
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const tokens = await this.authService.refresh(refreshToken);
    this.refreshCookie.set(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Log out',
    description: 'Invalidates the refresh token cookie server-side and clears the cookie.',
  })
  @ApiCookieAuth('refresh-cookie')
  @ApiResponse({ status: 200, type: LogoutResponseDto })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = this.refreshCookie.read(req);
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    this.refreshCookie.clear(res);
    return { success: true };
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset email' })
  @ApiResponse({ status: 200, schema: { example: { message: 'If an account with that email exists, a password reset link has been sent.' } } })
  @ApiResponse({ status: 400, schema: { example: { errors: { email: ['email is required'] }, statusCode: 400, message: 'Validation failed', error: 'Bad Request' } } })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token from email' })
  @ApiResponse({ status: 200, schema: { example: { message: 'Password reset successful' } } })
  @ApiResponse({ status: 400, schema: { example: { errors: { token: ['token is invalid'], password: ['password is required'] }, statusCode: 400, message: 'Validation failed', error: 'Bad Request' } } })
  @ApiResponse({ status: 403, description: 'Account suspended', schema: { example: { statusCode: 403, message: 'Account suspended', error: 'Forbidden' } } })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.resetPassword(dto);
    this.refreshCookie.clear(res);
    return result;
  }
}
