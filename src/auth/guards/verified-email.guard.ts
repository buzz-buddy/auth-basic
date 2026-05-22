import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { VERIFIED_EMAIL_KEY } from '../decorators/verified-email.decorator';
import { UsersService } from '../../users/users.service';
import type { AuthenticatedUser } from '../../common/types/jwt-payload.type';

@Injectable()
export class VerifiedEmailGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiresVerified = this.reflector.getAllAndOverride<boolean>(
      VERIFIED_EMAIL_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiresVerified) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: AuthenticatedUser }>();
    const authUser = request.user;
    if (!authUser?.sub) {
      return false;
    }

    const user = await this.usersService.findById(authUser.sub);
    if (!user?.emailVerified) {
      throw new ForbiddenException('Email verification required');
    }

    return true;
  }
}
