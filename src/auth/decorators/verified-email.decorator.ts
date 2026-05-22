import { SetMetadata } from '@nestjs/common';

export const VERIFIED_EMAIL_KEY = 'verifiedEmail';
export const VerifiedEmail = () => SetMetadata(VERIFIED_EMAIL_KEY, true);
