import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WorkerIngestionModule } from './../src/worker-ingestion.module';

describe('WorkerIngestionController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WorkerIngestionModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/worker-ingestion/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/worker-ingestion/health')
      .expect(200)
      .expect({ status: 'ready', processed: 0 });
  });
});
