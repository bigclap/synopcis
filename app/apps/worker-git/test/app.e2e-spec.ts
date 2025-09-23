import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WorkerGitModule } from './../src/worker-git.module';

describe('WorkerGitController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WorkerGitModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/worker-git/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/worker-git/health')
      .expect(200)
      .expect({ status: 'ready', commits: 0 });
  });
});
