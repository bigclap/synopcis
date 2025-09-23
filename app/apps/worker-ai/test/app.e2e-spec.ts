import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WorkerAiModule } from './../src/worker-ai.module';

describe('WorkerAiController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WorkerAiModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/worker-ai/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/worker-ai/health')
      .expect(200)
      .expect({ status: 'ready', processed: 0 });
  });
});
