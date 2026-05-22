import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { Role } from '../common/enums/role.enum';
import { userPublicSelect } from '../common/types/user-public.type';
import { JwtPayload } from '../common/types/jwt-payload.type';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  private readonly bcryptRounds = 12;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, this.bcryptRounds);
    const verificationToken = randomBytes(32).toString('base64url');
    const expiresAt = this.parseDurationToDate(
      this.configService.get('EMAIL_VERIFICATION_EXPIRES_IN', '24h'),
    );

    const user = await this.prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email: dto.email,
          password: passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          displayName: dto.displayName,
          avatarUrl: dto.avatarUrl,
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
          status: UserStatus.ACTIVE,
          emailVerified: false,
        },
        select: userPublicSelect,
      });

      await tx.emailVerificationToken.create({
        data: {
          tokenHash: this.hashToken(verificationToken),
          userId: created.id,
          expiresAt,
        },
      });

      return created;
    });

    const tokens = await this.issueTokens(
      user.id,
      user.email,
      user.role as Role,
    );

    const response: Record<string, unknown> = {
      message:
        'Registration successful. Email verification is optional for now.',
      user,
      ...tokens,
    };

    if (this.configService.get('NODE_ENV') !== 'production') {
      response.verificationToken = verificationToken;
    }

    return response;
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const tokenHash = this.hashToken(dto.token);
    const stored = await this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    if (stored.user.emailVerified) {
      await this.prisma.emailVerificationToken.deleteMany({
        where: { userId: stored.userId },
      });
      return this.issueTokens(
        stored.user.id,
        stored.user.email,
        stored.user.role as Role,
      );
    }

    await this.prisma.$transaction([
      this.prisma.emailVerificationToken.deleteMany({
        where: { userId: stored.userId },
      }),
      this.prisma.user.update({
        where: { id: stored.userId },
        data: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
          status: UserStatus.ACTIVE,
        },
      }),
    ]);

    return this.issueTokens(
      stored.user.id,
      stored.user.email,
      stored.user.role as Role,
    );
  }

  async resendVerification(dto: ResendVerificationDto) {
    const genericMessage =
      'If the account exists and is unverified, a new verification email has been sent.';

    const user = await this.usersService.findByEmail(dto.email);
    if (!user || user.emailVerified) {
      return { message: genericMessage };
    }

    const verificationToken = randomBytes(32).toString('base64url');
    const expiresAt = this.parseDurationToDate(
      this.configService.get('EMAIL_VERIFICATION_EXPIRES_IN', '24h'),
    );

    await this.prisma.$transaction([
      this.prisma.emailVerificationToken.deleteMany({
        where: { userId: user.id },
      }),
      this.prisma.emailVerificationToken.create({
        data: {
          tokenHash: this.hashToken(verificationToken),
          userId: user.id,
          expiresAt,
        },
      }),
    ]);

    const response: Record<string, unknown> = { message: genericMessage };
    if (this.configService.get('NODE_ENV') !== 'production') {
      response.verificationToken = verificationToken;
    }

    return response;
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.assertAccountCanAuthenticate(user);

    await this.usersService.updateLastLogin(user.id);

    return this.issueTokens(user.id, user.email, user.role as Role);
  }

  async refresh(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    this.assertAccountCanAuthenticate(stored.user);

    await this.prisma.refreshToken.delete({ where: { id: stored.id } });

    return this.issueTokens(
      stored.user.id,
      stored.user.email,
      stored.user.role as Role,
    );
  }

  async logout(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    await this.prisma.refreshToken.deleteMany({ where: { tokenHash } });
    return { success: true };
  }

  private assertAccountCanAuthenticate(user: { status: UserStatus }) {
    if (user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenException('Account suspended');
    }
  }

  private async issueTokens(
    userId: string,
    email: string,
    role: Role,
  ): Promise<AuthTokens> {
    const payload: JwtPayload = { sub: userId, email, role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN', '15m'),
    });

    const refreshToken = randomBytes(48).toString('base64url');
    const refreshExpiresIn = this.configService.get(
      'JWT_REFRESH_EXPIRES_IN',
      '7d',
    );
    const expiresAt = this.parseDurationToDate(refreshExpiresIn);

    await this.prisma.refreshToken.create({
      data: {
        tokenHash: this.hashToken(refreshToken),
        userId,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private parseDurationToDate(duration: string): Date {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Invalid duration format: ${duration}`);
    }
    const value = Number(match[1]);
    const unit = match[2];
    const msByUnit: Record<string, number> = {
      s: 1000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };
    return new Date(Date.now() + value * msByUnit[unit]);
  }
}
