import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';

export type UserPublicFields = {
  id: string;
  email: string;
  role: Role;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  dateOfBirth: Date | null;
  status: UserStatus;
  emailVerified: boolean;
  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export const userPublicSelect = {
  id: true,
  email: true,
  role: true,
  firstName: true,
  lastName: true,
  displayName: true,
  avatarUrl: true,
  dateOfBirth: true,
  status: true,
  emailVerified: true,
  emailVerifiedAt: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} as const;
