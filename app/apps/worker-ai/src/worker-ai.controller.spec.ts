import { Test, TestingModule } from '@nestjs/testing';
import { SharedKernelModule } from '@synop/shared-kernel';
import { WorkerAiController } from './worker-ai.controller';
import { WorkerAiService } from './worker-ai.service';

describe('WorkerAiController', () => {
  let controller: WorkerAiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedKernelModule],
      controllers: [WorkerAiController],
      providers: [WorkerAiService],
    }).compile();

    controller = module.get(WorkerAiController);
  });

  it('reports the worker status', () => {
    expect(controller.health()).toEqual({ status: 'ready', processed: 0 });
  });
});
