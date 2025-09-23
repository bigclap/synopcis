import { Test, TestingModule } from '@nestjs/testing';
import { SharedKernelService } from './shared-kernel.service';
import { TaskType } from './events';

describe('SharedKernelService', () => {
  let service: SharedKernelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedKernelService],
    }).compile();

    service = module.get<SharedKernelService>(SharedKernelService);
  });

  it('builds task message with defaults', () => {
    const message = service.buildTaskMessage({
      type: TaskType.RENDER_STATIC,
      payload: { slug: 'albert-einstein' },
    });

    expect(message.id).toBeDefined();
    expect(message.createdAt).toBeInstanceOf(Date);
    expect(message.priority).toBe('normal');
    expect(message.payload).toEqual({ slug: 'albert-einstein' });
  });
});
