import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

export type GoogleIdTokenPayload = {
  sub: string;
  email: string;
  emailVerified: boolean;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
};

@Injectable()
export class GoogleAuthService {
  private readonly client: OAuth2Client;
  private readonly clientId: string;

  constructor(private configService: ConfigService) {
    this.clientId = this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID');
    this.client = new OAuth2Client(this.clientId);
  }

  async verifyIdToken(idToken: string): Promise<GoogleIdTokenPayload> {
    let payload;
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.clientId,
      });
      payload = ticket.getPayload();
    } catch {
      throw new UnauthorizedException('Invalid Google ID token');
    }

    if (!payload?.sub || !payload.email) {
      throw new UnauthorizedException('Invalid Google ID token');
    }

    if (!payload.email_verified) {
      throw new UnauthorizedException('Google email is not verified');
    }

    return {
      sub: payload.sub,
      email: payload.email.toLowerCase(),
      emailVerified: true,
      firstName: payload.given_name ?? null,
      lastName: payload.family_name ?? null,
      displayName: payload.name ?? null,
    };
  }
}
