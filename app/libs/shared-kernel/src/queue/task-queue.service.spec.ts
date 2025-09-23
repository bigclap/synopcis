import { Test, TestingModule } from '@nestjs/testing';
import { createTaskMessage, TaskType } from '../events';
import { TaskQueueService } from './task-queue.service';

describe('TaskQueueService', () => {
  let service: TaskQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskQueueService],
    }).compile();

    service = module.get(TaskQueueService);
  });

  it('delivers messages to consumers', async () => {
    const processed: string[] = [];
    service.consume(TaskType.RENDER_STATIC, async (task) => {
      processed.push(task.payload.slug);
      return {
        taskId: task.id,
        type: task.type,
        status: 'completed',
      };
    });

    service.publish(
      createTaskMessage({
        type: TaskType.RENDER_STATIC,
        payload: { slug: 'einstein' },
      }),
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(processed).toEqual(['einstein']);
  });

  it('emits errors when consumer throws', async () => {
    const errors: string[] = [];
    service.errors().subscribe((error) => errors.push(error.error.message));

    service.consume(TaskType.ANALYZE_SOURCE, () => {
      throw new Error('boom');
    });

    service.publish(
      createTaskMessage({
        type: TaskType.ANALYZE_SOURCE,
        payload: { url: 'https://example.com' },
      }),
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(errors).toEqual(['boom']);
  });
});
