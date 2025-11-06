import { Test, TestingModule } from '@nestjs/testing';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { TaskType } from '@synop/shared-kernel';

describe('GatewayController', () => {
  let controller: GatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatewayController],
      providers: [
        {
          provide: GatewayService,
          useValue: {
            scheduleRenderTask: jest.fn((dto) => ({
              type: TaskType.RENDER_STATIC,
              payload: dto,
            })),
            scheduleAiAnalysis: jest.fn((dto) => ({
              type: TaskType.ANALYZE_SOURCE,
              payload: dto,
            })),
          },
        },
      ],
    }).compile();

    controller = module.get(GatewayController);
  });

  it('returns a healthy status payload', () => {
    expect(controller.health()).toEqual({ status: 'ok' });
  });

  it('schedules render tasks through the gateway service', async () => {
    const result = await controller.enqueueRender({ slug: 'relativity' });
    expect(result.type).toBe(TaskType.RENDER_STATIC);
    expect(result.payload).toEqual({ slug: 'relativity' });
  });
});
