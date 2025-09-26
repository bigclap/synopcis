import { Test, TestingModule } from '@nestjs/testing';
import { SharedKernelModule } from '@synop/shared-kernel';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedKernelModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get(AppController);
  });

  it('returns queue status snapshot', () => {
    const status = controller.getStatus();
    expect(status.workers).toBe(0);
    expect(status.errorCount).toBe(0);
    expect(status.lastError).toBeNull();
  });
});
