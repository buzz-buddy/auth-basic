import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly avatarPrefix: string;
  private readonly presignedExpiresIn: number;

  constructor(private configService: ConfigService) {
    const region = this.configService.getOrThrow<string>('AWS_REGION');
    this.bucket = this.configService.getOrThrow<string>('AWS_S3_BUCKET');
    this.avatarPrefix = this.configService
      .get<string>('AWS_S3_AVATAR_PREFIX', 'avatars')
      .replace(/^\/+|\/+$/g, '');
    this.presignedExpiresIn = Number(
      this.configService.get('AWS_S3_PRESIGNED_URL_EXPIRES_IN', '3600'),
    );

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const extension = EXTENSION_BY_MIME[file.mimetype];
    if (!extension) {
      throw new Error(`Unsupported mime type: ${file.mimetype}`);
    }

    const key = `${this.avatarPrefix}/${userId}/${Date.now()}-${randomBytes(8).toString('hex')}.${extension}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return key;
  }

  async getPresignedReadUrl(key: string): Promise<string> {
    return getSignedUrl(
      this.s3Client,
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
      { expiresIn: this.presignedExpiresIn },
    );
  }

  async deleteAvatar(stored: string | null | undefined) {
    const key = this.resolveStoredAvatarKey(stored);
    if (!key) {
      return;
    }

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  /**
   * DB `avatarUrl` holds the S3 object key (e.g. avatars/userId/file.jpg).
   * Legacy rows may still hold a full HTTPS URL from an earlier public-bucket setup.
   */
  resolveStoredAvatarKey(stored: string | null | undefined): string | null {
    if (!stored) {
      return null;
    }

    if (stored.startsWith(`${this.avatarPrefix}/`)) {
      return stored;
    }

    if (stored.startsWith('http://') || stored.startsWith('https://')) {
      return this.extractKeyFromLegacyUrl(stored);
    }

    return null;
  }

  private extractKeyFromLegacyUrl(url: string): string | null {
    try {
      const pathname = new URL(url).pathname.replace(/^\//, '');
      if (pathname.startsWith(`${this.avatarPrefix}/`)) {
        return pathname;
      }
    } catch {
      return null;
    }
    return null;
  }
}
