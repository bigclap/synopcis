import { Test, TestingModule } from '@nestjs/testing';
import { RenderModule } from '@synop/rendering';
import {
  SharedKernelModule,
  SharedKernelService,
  TaskQueueService,
  TaskType,
} from '@synop/shared-kernel';
import { WorkerFrontendController } from './worker-frontend.controller';
import { WorkerFrontendService } from './worker-frontend.service';

async function waitForQueue() {
  await new Promise((resolve) => setTimeout(resolve, 50));
}

describe('WorkerFrontendController', () => {
  let moduleRef: TestingModule;
  let controller: WorkerFrontendController;
  let queue: TaskQueueService;
  let sharedKernel: SharedKernelService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [SharedKernelModule, RenderModule],
      controllers: [WorkerFrontendController],
      providers: [WorkerFrontendService],
    }).compile();

    await moduleRef.init();

    controller = moduleRef.get(WorkerFrontendController);
    queue = moduleRef.get(TaskQueueService);
    sharedKernel = moduleRef.get(SharedKernelService);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('returns the worker health snapshot', () => {
    expect(controller.health()).toEqual({ status: 'ready', renders: 0 });
  });

  it('collects render summaries after tasks are processed', async () => {
    queue.publish(
      sharedKernel.buildTaskMessage({
        type: TaskType.RENDER_STATIC,
        payload: {
          slug: 'relativity',
          viewer: { id: 'user-17', roles: ['member'] },
        },
      }),
    );

    await waitForQueue();
    await waitForQueue();

    const renders = controller.renders('3');
    expect(renders.length).toBeGreaterThan(0);
    expect(renders[0]).toMatchObject({ slug: 'relativity' });
  });
});
