import { Injectable } from '@nestjs/common';
import { Role, UserStatus } from '@prisma/client';
import { userPublicSelect } from '../common/types/user-public.type';
import { PrismaService } from '../prisma/prisma.service';

export type CreateUserData = {
  email: string;
  password: string;
  role?: Role;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  dateOfBirth?: Date;
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: userPublicSelect,
    });
  }

  create(data: CreateUserData) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role ?? Role.USER,
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
        dateOfBirth: data.dateOfBirth,
        status: UserStatus.ACTIVE,
        emailVerified: false,
      },
      select: userPublicSelect,
    });
  }

  markEmailVerified(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        status: UserStatus.ACTIVE,
      },
      select: userPublicSelect,
    });
  }

  updateLastLogin(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      displayName?: string;
      avatarUrl?: string;
      dateOfBirth?: Date;
    },
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
        dateOfBirth: data.dateOfBirth,
      },
      select: userPublicSelect,
    });
  }
}
