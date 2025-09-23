import { Test, TestingModule } from '@nestjs/testing';
import { DomainsModule } from '@synop/domains';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DomainsModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get(AppController);
  });

  it('returns queue status snapshot', () => {
    const status = controller.getStatus();
    expect(status.workers).toEqual([]);
    expect(status.errorCount).toBe(0);
  });
});
