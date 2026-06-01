import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly sesClient: SESClient;
  private readonly fromEmail: string;

  constructor(private configService: ConfigService) {
    this.fromEmail = this.configService.getOrThrow<string>('SES_FROM_EMAIL');
    this.sesClient = new SESClient({
      region: this.configService.getOrThrow<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async sendEmailVerificationEmail(to: string, verificationToken: string) {
    const verifyUrl = this.configService.getOrThrow<string>(
      'APP_VERIFY_EMAIL_URL',
    );
    const verifyLink = `${verifyUrl}?token=${verificationToken}`;

    await this.sesClient.send(
      new SendEmailCommand({
        Source: this.fromEmail,
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: 'Verify your email', Charset: 'UTF-8' },
          Body: {
            Text: {
              Data: [
                'Thanks for signing up.',
                '',
                'Verify your email by visiting this link (expires soon):',
                verifyLink,
                '',
                'If you did not create an account, you can safely ignore this email.',
              ].join('\n'),
              Charset: 'UTF-8',
            },
            Html: {
              Data: [
                '<p>Thanks for signing up.</p>',
                `<p><a href="${verifyLink}">Verify your email</a></p>`,
                '<p>If you did not create an account, you can safely ignore this email.</p>',
              ].join(''),
              Charset: 'UTF-8',
            },
          },
        },
      }),
    );
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    const resetUrl = this.configService.getOrThrow<string>(
      'APP_RESET_PASSWORD_URL',
    );
    const resetLink = `${resetUrl}?token=${resetToken}`;

    await this.sesClient.send(
      new SendEmailCommand({
        Source: this.fromEmail,
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: 'Reset your password', Charset: 'UTF-8' },
          Body: {
            Text: {
              Data: [
                'You requested a password reset.',
                '',
                `Reset your password by visiting this link (expires soon):`,
                resetLink,
                '',
                'If you did not request this, you can safely ignore this email.',
              ].join('\n'),
              Charset: 'UTF-8',
            },
            Html: {
              Data: [
                '<p>You requested a password reset.</p>',
                `<p><a href="${resetLink}">Reset your password</a></p>`,
                '<p>If you did not request this, you can safely ignore this email.</p>',
              ].join(''),
              Charset: 'UTF-8',
            },
          },
        },
      }),
    );
  }
}
