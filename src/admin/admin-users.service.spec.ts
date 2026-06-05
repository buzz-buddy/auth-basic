import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Role, UserStatus } from '@prisma/client';
import { AdminUsersService } from './admin-users.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';

describe('AdminUsersService', () => {
  let service: AdminUsersService;
  let prisma: {
    user: {
      count: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    $transaction: jest.Mock;
  };
  let usersService: {
    findByEmail: jest.Mock;
    toPublicUser: jest.Mock;
  };
  let authService: { forgotPassword: jest.Mock };

  const publicUser = {
    id: 'user-1',
    email: 'a@example.com',
    role: Role.USER,
    firstName: null,
    lastName: null,
    displayName: null,
    avatarUrl: null,
    dateOfBirth: null,
    status: UserStatus.ACTIVE,
    emailVerified: true,
    emailVerifiedAt: new Date(),
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    prisma = {
      user: {
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn(),
    };
    usersService = {
      findByEmail: jest.fn(),
      toPublicUser: jest.fn((u) => Promise.resolve(u)),
    };
    authService = { forgotPassword: jest.fn() };

    service = new AdminUsersService(
      prisma as unknown as PrismaService,
      usersService as unknown as UsersService,
      {} as MailService,
      { get: jest.fn() } as unknown as ConfigService,
      authService as unknown as AuthService,
    );
  });

  describe('listUsers', () => {
    it('returns paginated users', async () => {
      prisma.user.count.mockResolvedValue(25);
      prisma.user.findMany.mockResolvedValue([publicUser]);

      const result = await service.listUsers({ page: 2, limit: 10 });

      expect(result.total).toBe(25);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(3);
      expect(result.items).toHaveLength(1);
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 10 }),
      );
    });

    it('caps limit at 100', async () => {
      prisma.user.count.mockResolvedValue(0);
      prisma.user.findMany.mockResolvedValue([]);

      await service.listUsers({ limit: 500 });

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 100 }),
      );
    });
  });

  describe('findUserById', () => {
    it('throws when user missing', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.findUserById('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    const adminRecord = {
      id: 'admin-1',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    };

    it('blocks changing own role', async () => {
      prisma.user.findUnique.mockResolvedValue(adminRecord);

      await expect(
        service.updateUser('admin-1', { role: Role.USER }, 'admin-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('blocks demoting the last admin', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'admin-1',
        role: Role.ADMIN,
        status: UserStatus.ACTIVE,
      });
      prisma.user.count.mockResolvedValue(1);
      prisma.user.findFirst.mockResolvedValue({ id: 'admin-1' });

      await expect(
        service.updateUser('admin-1', { role: Role.USER }, 'admin-2'),
      ).rejects.toThrow(BadRequestException);
    });

    it('updates user when allowed', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        role: Role.USER,
        status: UserStatus.ACTIVE,
      });
      prisma.user.update.mockResolvedValue(publicUser);

      const result = await service.updateUser(
        'user-1',
        { status: UserStatus.SUSPENDED },
        'admin-1',
      );

      expect(result).toEqual(publicUser);
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: UserStatus.SUSPENDED },
        }),
      );
    });
  });

  describe('sendPasswordReset', () => {
    it('delegates to auth forgotPassword', async () => {
      prisma.user.findUnique.mockResolvedValue({ email: 'a@example.com' });
      authService.forgotPassword.mockResolvedValue({ message: 'ok' });

      const result = await service.sendPasswordReset('user-1');

      expect(authService.forgotPassword).toHaveBeenCalledWith({
        email: 'a@example.com',
      });
      expect(result).toEqual({ message: 'ok' });
    });
  });
});
