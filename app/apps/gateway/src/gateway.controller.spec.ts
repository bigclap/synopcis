import { Test, TestingModule } from '@nestjs/testing';
import { DomainsModule } from '@synop/domains';
import { TaskType } from '@synop/shared-kernel';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';

describe('GatewayController', () => {
  let controller: GatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DomainsModule],
      controllers: [GatewayController],
      providers: [GatewayService],
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
