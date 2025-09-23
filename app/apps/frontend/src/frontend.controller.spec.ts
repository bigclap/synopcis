import { Test, TestingModule } from '@nestjs/testing';
import { SharedKernelModule } from '@synop/shared-kernel';
import { FrontendController } from './frontend.controller';
import { FrontendService } from './frontend.service';

describe('FrontendController', () => {
  let controller: FrontendController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedKernelModule],
      controllers: [FrontendController],
      providers: [FrontendService],
    }).compile();

    controller = module.get(FrontendController);
  });

  it('returns manifest metadata', () => {
    const manifest = controller.manifest();
    expect(manifest.version).toBe('0.1.0');
    expect(manifest.hydration).toBe('dynamic');
  });
});
