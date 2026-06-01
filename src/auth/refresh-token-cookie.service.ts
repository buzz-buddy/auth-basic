import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Request, Response } from 'express';

@Injectable()
export class RefreshTokenCookieService {
  constructor(private configService: ConfigService) {}

  get name(): string {
    return this.configService.get('REFRESH_TOKEN_COOKIE_NAME', 'refreshToken');
  }

  read(req: Request): string | undefined {
    const value = req.cookies?.[this.name];
    return typeof value === 'string' && value.length > 0 ? value : undefined;
  }

  set(res: Response, refreshToken: string) {
    res.cookie(this.name, refreshToken, this.buildOptions());
  }

  clear(res: Response) {
    res.clearCookie(this.name, this.buildClearOptions());
  }

  private buildOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.isSecure(),
      sameSite: this.sameSite(),
      path: '/auth',
      maxAge: this.maxAgeMs(),
    };
  }

  private buildClearOptions(): CookieOptions {
    const { maxAge: _maxAge, ...options } = this.buildOptions();
    return options;
  }

  private isSecure(): boolean {
    const configured = this.configService.get<string>('COOKIE_SECURE');
    if (configured !== undefined) {
      return configured === 'true';
    }
    return this.configService.get('NODE_ENV') === 'production';
  }

  private sameSite(): CookieOptions['sameSite'] {
    const value = this.configService.get<string>('COOKIE_SAME_SITE', 'lax');
    if (value === 'strict' || value === 'lax' || value === 'none') {
      return value;
    }
    return 'lax';
  }

  private maxAgeMs(): number {
    const duration = this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d');
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Invalid duration format: ${duration}`);
    }
    const value = Number(match[1]);
    const msByUnit: Record<string, number> = {
      s: 1000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };
    return value * msByUnit[match[2]];
  }
}
