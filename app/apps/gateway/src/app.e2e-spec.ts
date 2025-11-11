import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { GatewayModule } from './../src/gateway.module';

describe('GatewayController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GatewayModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/tasks/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/tasks/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  it('/tasks/render (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks/render')
      .send({ slug: 'relativity' })
      .expect(201);

    expect(response.body.type).toBe('render.static');
    expect(response.body.payload).toEqual({ slug: 'relativity' });
  });
});
