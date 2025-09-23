import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { FrontendModule } from './../src/frontend.module';

describe('FrontendController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FrontendModule],
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

  it('/frontend/manifest (GET)', () => {
    return request(app.getHttpServer())
      .get('/frontend/manifest')
      .expect(200)
      .expect((response) => {
        expect(response.body.version).toBe('0.1.0');
      });
  });

  it('/frontend/render (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/frontend/render')
      .send({ markdown: '# Title' })
      .expect(201);

    expect(response.body.html).toContain('<h1>Title</h1>');
  });
});
