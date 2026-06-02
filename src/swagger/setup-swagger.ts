import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = app.get(ConfigService);
  const cookieName = config.get('REFRESH_TOKEN_COOKIE_NAME', 'refreshToken');

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Buzzzzed backend API documentation')
      .setDescription(
        [
          'REST API for authentication, user profiles. This API is used to manage the backend of the Buzzzzed platform.',
          '',
          '**Authentication**',
          '- After login/register/verify-email/refresh, the **refresh token** is set in an httpOnly cookie (`' +
            cookieName +
            '`).',
          '- The response body returns **`accessToken`** only. Send it as `Authorization: Bearer <accessToken>` on protected routes.',
          '- Call `/auth/refresh` and `/auth/logout` with `credentials: include` so the browser sends the cookie.',
          '',
          '**Validation errors** (`400`) include an `errors` object keyed by field name.',
          '**General errors** use `message` only (no `errors` object).',
        ].join('\n'),
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT access token from login / register / refresh / verify-email',
        },
        'access-token',
      )
      .addCookieAuth(
        cookieName,
        {
          type: 'apiKey',
          in: 'cookie',
          description:
            'httpOnly refresh token (set automatically on login, register, verify-email, refresh)',
        },
        'refresh-cookie',
      )
      .build(),
  );

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      withCredentials: true,
    },
  });
}
