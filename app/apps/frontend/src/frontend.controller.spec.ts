import { Test, TestingModule } from '@nestjs/testing';
import { RenderModule } from '@synop/rendering';
import { FrontendController } from './frontend.controller';
import { FrontendService } from './frontend.service';

describe('FrontendController', () => {
  let moduleRef: TestingModule;
  let controller: FrontendController;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [RenderModule],
      controllers: [FrontendController],
      providers: [FrontendService],
    }).compile();

    controller = moduleRef.get(FrontendController);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('returns manifest metadata for a given slug', () => {
    const result = controller.manifest({ slug: 'relativity' });
    expect(result.metadata.slug).toBe('relativity');
    expect(result.manifest.layout).toHaveLength(5);
    expect(result.staticContentKeys).toContain('hero');
  });

  it('renders a page with hydration details', async () => {
    const response = await controller.render({ slug: 'relativity' });
    expect(response.metadata.title).toContain('Relativity');
    expect(response.rendered.blocks.length).toBeGreaterThan(0);
    expect(response.rendered.hydration.subscriptions.length).toBeGreaterThan(0);
  });
});
