import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { validationExceptionFactory } from '../src/common/validation/validation-exception.factory';
import { MailService } from '../src/mail/mail.service';

describe('Persona (e2e)', () => {
  jest.setTimeout(30_000);

  let app: INestApplication<App>;
  let accessToken: string;
  let personaQuestionId: number;
  let personaQuestionName: string;
  let personaComponentId: number;
  let personaSubComponentId: number;
  let personaComponentSlug: string;
  let personaSubComponentSlug: string;

  const email = `persona-e2e-${Date.now()}@example.com`;
  const password = 'password123';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailService)
      .useValue({
        sendEmailVerificationEmail: jest.fn().mockResolvedValue(undefined),
        sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        stopAtFirstError: true,
        skipMissingProperties: false,
        exceptionFactory: validationExceptionFactory,
      }),
    );
    await app.init();

    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password })
      .expect(201);

    accessToken = registerRes.body.accessToken;
    expect(accessToken).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /workspaces/me returns workspace with persona resume', async () => {
    const res = await request(app.getHttpServer())
      .get('/workspaces/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.id).toBeDefined();
    expect(res.body.persona).toMatchObject({
      status: 'DRAFT',
      schemaVersion: 1,
    });
    expect(res.body.persona.resume).toMatchObject({
      personaComponentId: expect.any(Number),
      personaSubComponentId: expect.any(Number),
    });

    personaComponentId = res.body.persona.resume.personaComponentId;
    personaSubComponentId = res.body.persona.resume.personaSubComponentId;
  });

  it('GET /workspaces/me/persona/schema resolves slugs for nested routes', async () => {
    const res = await request(app.getHttpServer())
      .get('/workspaces/me/persona/schema')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    personaComponentSlug = res.body.personaComponents[0].slug;
    personaSubComponentSlug =
      res.body.personaComponents[0].personaSubComponents[0].slug;

    const componentRes = await request(app.getHttpServer())
      .get(
        `/workspaces/me/persona/schema/persona-components/${personaComponentSlug}`,
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(componentRes.body.slug).toBe(personaComponentSlug);
  });

  it('GET /workspaces/me/persona/schema returns personaComponents tree', async () => {
    const res = await request(app.getHttpServer())
      .get('/workspaces/me/persona/schema')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.schemaVersion).toBe(1);
    expect(Array.isArray(res.body.personaComponents)).toBe(true);
    expect(res.body.personaComponents.length).toBeGreaterThan(0);

    const firstComponent = res.body.personaComponents[0];
    expect(firstComponent).toMatchObject({
      slug: expect.any(String),
    });
    expect(firstComponent.personaSubComponents.length).toBeGreaterThan(0);

    const firstSub = firstComponent.personaSubComponents[0];
    expect(firstSub).toMatchObject({
      slug: expect.any(String),
    });
    expect(firstSub.personaQuestions.length).toBeGreaterThan(0);

    personaQuestionId = firstSub.personaQuestions[0].id;
    personaQuestionName = firstSub.personaQuestions[0].name;
    expect(firstSub.personaQuestions[0]).toMatchObject({
      responseType: expect.stringMatching(/^(string|number|array)$/),
      userResponse: expect.anything(),
      aiValue: expect.anything(),
    });
  });

  it('GET sub-component page returns personaQuestions with responses', async () => {
    const res = await request(app.getHttpServer())
      .get(
        `/workspaces/me/persona/schema/persona-components/${personaComponentSlug}/persona-sub-components/${personaSubComponentSlug}`,
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.slug).toBe(personaSubComponentSlug);
    expect(res.body.id).toBe(personaSubComponentId);
    expect(res.body.personaQuestions.length).toBeGreaterThan(0);
    for (const question of res.body.personaQuestions) {
      expect(question.responseType).toMatch(/^(string|number|array)$/);
    }
  });

  it('PUT /workspaces/me/persona/responses saves userResponse', async () => {
    const res = await request(app.getHttpServer())
      .put('/workspaces/me/persona/responses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        personaComponentSlug,
        personaSubComponentSlug,
        responses: [
          {
            name: personaQuestionName,
            userResponse: 'Acme Corp',
          },
        ],
      })
      .expect(200);

    expect(res.body.success).toBe(true);

    const schemaRes = await request(app.getHttpServer())
      .get(
        `/workspaces/me/persona/schema/persona-components/${personaComponentSlug}/persona-sub-components/${personaSubComponentSlug}`,
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const question = schemaRes.body.personaQuestions.find(
      (q: { id: number }) => q.id === personaQuestionId,
    );
    expect(question.userResponse).toBe('Acme Corp');
  });

  it('PUT /workspaces/me/persona/responses accepts null for optional questions', async () => {
    const res = await request(app.getHttpServer())
      .put('/workspaces/me/persona/responses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        personaComponentSlug: 'content_strategy',
        personaSubComponentSlug: 'compliance',
        responses: [
          {
            name: 'industry_compliance',
            userResponse: null,
          },
        ],
      })
      .expect(200);

    expect(res.body.success).toBe(true);
  });

  it('PUT /workspaces/me/persona/responses accepts empty string for optional questions', async () => {
    const res = await request(app.getHttpServer())
      .put('/workspaces/me/persona/responses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        personaComponentSlug: 'content_strategy',
        personaSubComponentSlug: 'compliance',
        responses: [
          {
            name: 'industry_compliance',
            userResponse: '',
          },
        ],
      })
      .expect(200);

    expect(res.body.success).toBe(true);
  });

  it('PUT /workspaces/me/persona/responses reports required question name when userResponse is null', async () => {
    const res = await request(app.getHttpServer())
      .put('/workspaces/me/persona/responses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        personaComponentSlug,
        personaSubComponentSlug,
        responses: [
          {
            name: 'business_name',
            userResponse: null,
          },
        ],
      })
      .expect(400);

    expect(res.body.errors).toEqual({
      business_name: ['business_name should not be null or undefined'],
    });
  });

  it('PATCH /workspaces/me/persona/location updates resume', async () => {
    const res = await request(app.getHttpServer())
      .patch('/workspaces/me/persona/location')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ personaSubComponentId })
      .expect(200);

    expect(res.body.resume.personaSubComponentId).toBe(personaSubComponentId);
  });

  it('admin can update PersonaQuestion label', async () => {
    const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;
    const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) {
      return;
    }

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: adminEmail, password: adminPassword })
      .expect(200);

    const adminToken = loginRes.body.accessToken;

    const patchRes = await request(app.getHttpServer())
      .patch(`/admin/persona/persona-questions/${personaQuestionId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ label: 'Business Name (Updated)' })
      .expect(200);

    expect(patchRes.body.label).toBe('Business Name (Updated)');
  });
});
