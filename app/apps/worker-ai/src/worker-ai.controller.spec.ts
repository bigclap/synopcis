import { Test, TestingModule } from '@nestjs/testing';
import { DomainsModule } from '@synop/domains';
import { WorkerAiController } from './worker-ai.controller';
import { WorkerAiService } from './worker-ai.service';

describe('WorkerAiController', () => {
  let controller: WorkerAiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DomainsModule],
      controllers: [WorkerAiController],
      providers: [WorkerAiService],
    }).compile();

    controller = module.get(WorkerAiController);
  });

  it('reports the worker status', () => {
    expect(controller.health()).toEqual({ status: 'ready', processed: 0 });
  });
});
