import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, Role, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import {
  badRequestWithFieldErrors,
  conflictWithFieldErrors,
} from '../common/exceptions/field-http.exception';
import { userPublicSelect } from '../common/types/user-public.type';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { profileFieldsFromDto } from '../users/profile-fields.util';
import { UsersService } from '../users/users.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';

const BCRYPT_ROUNDS = 12;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

@Injectable()
export class AdminUsersService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private mailService: MailService,
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  async listUsers(query: ListUsersQueryDto) {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = Math.min(query.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const skip = (page - 1) * limit;
    const where = this.buildListWhere(query);

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: userPublicSelect,
      }),
    ]);

    const items = await Promise.all(
      users.map((user) => this.usersService.toPublicUser(user)),
    );

    return {
      items,
      total,
      page,
      limit,
      totalPages: total === 0 ? 0 : Math.ceil(total / limit),
    };
  }

  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userPublicSelect,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.usersService.toPublicUser(user);
  }

  async createUser(dto: CreateAdminUserDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw conflictWithFieldErrors(
        { email: ['Email already registered'] },
        'User creation failed',
      );
    }

    const emailVerified = dto.emailVerified ?? true;
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const profile = profileFieldsFromDto(dto);
    const role = dto.role ?? Role.USER;

    if (!emailVerified) {
      const verificationToken = randomBytes(32).toString('base64url');
      const expiresAt = this.parseDurationToDate(
        this.configService.get('EMAIL_VERIFICATION_EXPIRES_IN', '24h'),
      );

      const user = await this.prisma.$transaction(async (tx) => {
        const created = await tx.user.create({
          data: {
            email: dto.email,
            password: passwordHash,
            role,
            ...profile,
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

      await this.mailService.sendEmailVerificationEmail(
        user.email,
        verificationToken,
      );

      return this.usersService.toPublicUser(user);
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: passwordHash,
        role,
        ...profile,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
      select: userPublicSelect,
    });

    return this.usersService.toPublicUser(user);
  }

  async updateUser(
    targetUserId: string,
    dto: UpdateAdminUserDto,
    actingAdminId: string,
  ) {
    const existing = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    await this.assertCanModifyUser(existing.id, actingAdminId, dto, existing);

    const profile = profileFieldsFromDto(dto);
    const data: Prisma.UserUpdateInput = { ...profile };

    if (dto.role !== undefined) {
      data.role = dto.role;
    }
    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    const user = await this.prisma.user.update({
      where: { id: targetUserId },
      data,
      select: userPublicSelect,
    });

    return this.usersService.toPublicUser(user);
  }

  async sendPasswordReset(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.authService.forgotPassword({ email: user.email });
  }

  private buildListWhere(query: ListUsersQueryDto): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {};

    if (query.role) {
      where.role = query.role;
    }
    if (query.status) {
      where.status = query.status;
    }

    const search = query.search?.trim();
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private async assertCanModifyUser(
    targetUserId: string,
    actingAdminId: string,
    dto: UpdateAdminUserDto,
    existing: { id: string; role: Role; status: UserStatus },
  ) {
    const changingRole = dto.role !== undefined && dto.role !== existing.role;
    const changingStatus =
      dto.status !== undefined && dto.status !== existing.status;

    if (
      targetUserId === actingAdminId &&
      (changingRole || changingStatus)
    ) {
      throw badRequestWithFieldErrors(
        {
          ...(changingRole ? { role: ['You cannot change your own role'] } : {}),
          ...(changingStatus
            ? { status: ['You cannot change your own status'] }
            : {}),
        },
        'Update failed',
      );
    }

    const demotingAdmin =
      existing.role === Role.ADMIN &&
      dto.role === Role.USER;
    const suspendingAdmin =
      existing.role === Role.ADMIN &&
      dto.status === UserStatus.SUSPENDED;

    if (demotingAdmin || suspendingAdmin) {
      await this.assertNotLastAdmin(existing.id);
    }
  }

  private async assertNotLastAdmin(targetUserId: string) {
    const adminCount = await this.prisma.user.count({
      where: { role: Role.ADMIN },
    });
    if (adminCount <= 1) {
      const targetIsAdmin = await this.prisma.user.findFirst({
        where: { id: targetUserId, role: Role.ADMIN },
      });
      if (targetIsAdmin) {
        throw badRequestWithFieldErrors(
          { role: ['Cannot remove or suspend the last admin account'] },
          'Update failed',
        );
      }
    }
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
