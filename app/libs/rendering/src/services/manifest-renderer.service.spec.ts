import { Test, TestingModule } from '@nestjs/testing';
import { RenderModule } from '../render.module';
import { ManifestRenderer } from './manifest-renderer.service';
import { createDemoPageRegistry } from '../data/in-memory-page-registry';

describe('ManifestRenderer', () => {
  let moduleRef: TestingModule;
  let renderer: ManifestRenderer;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [RenderModule],
    }).compile();

    renderer = moduleRef.get(ManifestRenderer);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('renders a page with hydration state for an authenticated viewer', async () => {
    const registry = createDemoPageRegistry();
    const resolved = registry.resolve('relativity');
    expect(resolved).toBeTruthy();
    if (!resolved) {
      return;
    }

    const rendered = await renderer.renderPage(resolved.manifest, {
      viewer: { id: 'user-1', roles: ['member'] },
      content: resolved.content,
      dataProvider: resolved.createHydrationProvider(),
      now: new Date('2025-01-07T00:00:00.000Z'),
      defaultHydrationIntervalMs: 8_000,
    });

    expect(rendered.blocks).toHaveLength(resolved.manifest.layout.length);
    expect(rendered.html).toContain('General Relativity');
    expect(rendered.hydration.initialState.votes).toMatchObject({ total: 421 });
    expect(rendered.hydration.fallbackTargets).toHaveLength(0);
    const votesSubscription = rendered.hydration.subscriptions.find(
      (subscription) => subscription.targetId === 'votes',
    );
    expect(votesSubscription?.cache?.key).toBe('votes:user:user-1');
  });

  it('applies fallback hydration for anonymous viewers', async () => {
    const registry = createDemoPageRegistry();
    const resolved = registry.resolve('relativity');
    expect(resolved).toBeTruthy();
    if (!resolved) {
      return;
    }

    const rendered = await renderer.renderPage(resolved.manifest, {
      viewer: { id: null },
      content: resolved.content,
      dataProvider: resolved.createHydrationProvider(),
      now: new Date('2025-01-07T00:05:00.000Z'),
    });

    expect(rendered.hydration.fallbackTargets).toContain('comments');
    expect(rendered.hydration.initialState.comments).toBeDefined();
    const commentsSubscription = rendered.hydration.subscriptions.find(
      (subscription) => subscription.targetId === 'comments',
    );
    expect(commentsSubscription?.cache?.key).toBeNull();
  });
});
