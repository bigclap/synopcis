import { Test, TestingModule } from '@nestjs/testing';
import {
  SharedKernelModule,
  TaskProcessingError,
  TaskQueueService,
  TaskType,
} from '@synop/shared-kernel';
import { DomainsService } from './domains.service';

describe('DomainsService', () => {
  let service: DomainsService;
  let queue: TaskQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedKernelModule],
      providers: [DomainsService],
    }).compile();

    service = module.get(DomainsService);
    queue = module.get(TaskQueueService);
  });

  it('delivers tasks to registered workers', async () => {
    const received: string[] = [];
    service.registerWorker(TaskType.RENDER_STATIC, async (task) => {
      received.push(task.payload.slug);
      return {
        taskId: task.id,
        type: task.type,
        status: 'completed',
        detail: 'rendered',
      };
    });

    await service.publishTask({
      type: TaskType.RENDER_STATIC,
      payload: { slug: 'einstein' },
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(received).toEqual(['einstein']);
    expect(service.registeredWorkers()).toContain(TaskType.RENDER_STATIC);
  });

  it('propagates worker errors through the queue error stream', async () => {
    const errors: TaskProcessingError[] = [];
    queue.errors().subscribe((error) => errors.push(error));

    service.registerWorker(TaskType.ANALYZE_SOURCE, () => {
      throw new Error('failed to analyze');
    });

    await service.publishTask({
      type: TaskType.ANALYZE_SOURCE,
      payload: { url: 'https://example.com' },
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(errors).toHaveLength(1);
    expect(errors[0].error.message).toBe('failed to analyze');
    expect(errors[0].task.type).toBe(TaskType.ANALYZE_SOURCE);
  });
});
