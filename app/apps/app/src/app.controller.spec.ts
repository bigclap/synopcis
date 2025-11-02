import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DomainsService } from '@synop/domains';
import { TaskQueueService } from '@synop/shared-kernel';
import { of } from 'rxjs';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            status: jest.fn(() => ({
              workers: [],
              errorCount: 0,
              lastError: null,
            })),
          },
        },
      ],
    }).compile();

    controller = module.get(AppController);
  });

  it('returns queue status snapshot', () => {
    const status = controller.getStatus();
    expect(status.workers).toEqual([]);
    expect(status.errorCount).toBe(0);
  });
});
