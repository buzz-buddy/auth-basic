import { Injectable, NotFoundException } from '@nestjs/common';
import { Role, UserStatus } from '@prisma/client';
import {
  userPublicSelect,
  type UserPublicFields,
} from '../common/types/user-public.type';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import type { UserProfileFieldsData } from './profile-fields.util';

export type CreateUserData = {
  email: string;
  password: string;
  role?: Role;
} & UserProfileFieldsData;

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userPublicSelect,
    });
    return this.toPublicUser(user);
  }

  async create(data: CreateUserData) {
    const { email, password, role, ...profile } = data;
    const user = await this.prisma.user.create({
      data: {
        email,
        password,
        role: role ?? Role.USER,
        ...profile,
        status: UserStatus.ACTIVE,
        emailVerified: false,
      },
      select: userPublicSelect,
    });
    return this.toPublicUser(user);
  }

  async markEmailVerified(userId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        status: UserStatus.ACTIVE,
      },
      select: userPublicSelect,
    });
    return this.toPublicUser(user);
  }

  updateLastLogin(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  async updateProfile(userId: string, data: UserProfileFieldsData) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: userPublicSelect,
    });
    return this.toPublicUser(user);
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const previousKey = user.avatarUrl;
    const avatarKey = await this.storageService.uploadAvatar(userId, file);

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: avatarKey },
      select: userPublicSelect,
    });

    await this.storageService.deleteAvatar(previousKey);

    return this.toPublicUser(updated);
  }

  async removeAvatar(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.storageService.deleteAvatar(user.avatarUrl);

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: null },
      select: userPublicSelect,
    });

    return this.toPublicUser(updated);
  }

  /** Maps stored S3 key to a time-limited presigned GET URL for API responses. */
  async toPublicUser<T extends UserPublicFields | null>(user: T): Promise<T> {
    if (!user?.avatarUrl) {
      return user;
    }

    const key = this.storageService.resolveStoredAvatarKey(user.avatarUrl);
    if (!key) {
      return { ...user, avatarUrl: null };
    }

    return {
      ...user,
      avatarUrl: await this.storageService.getPresignedReadUrl(key),
    };
  }
}
