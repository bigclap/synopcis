import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ManifestRenderer, createDemoPageRegistry } from '@synop/rendering';
import {
  TaskHandlerResult,
  TaskMessage,
  TaskQueueService,
  TaskType,
} from '@synop/shared-kernel';
import { Subscription } from 'rxjs';

interface FrontendRenderTaskPayload {
  readonly slug: string;
  readonly viewer?: {
    readonly id?: string | null;
    readonly roles?: readonly string[];
    readonly attributes?: Record<string, unknown>;
  };
  readonly source?: string;
}

interface RenderSummary {
  readonly taskId: string;
  readonly slug: string;
  readonly manifestVersion: string;
  readonly generatedAt: Date;
  readonly bytes: number;
  readonly hydratedTargets: readonly string[];
}

@Injectable()
export class WorkerFrontendService implements OnModuleInit, OnModuleDestroy {
  private readonly registry = createDemoPageRegistry();
  private readonly history: RenderSummary[] = [];
  private subscription?: Subscription;

  constructor(
    private readonly queue: TaskQueueService,
    private readonly renderer: ManifestRenderer,
  ) {}

  onModuleInit(): void {
    this.subscription = this.queue.consume<FrontendRenderTaskPayload>(
      TaskType.RENDER_STATIC,
      async (task) => this.handleRenderTask(task),
      { description: 'Frontend manifest renderer' },
    );
  }

  onModuleDestroy(): void {
    this.subscription?.unsubscribe();
  }

  status() {
    return {
      status: 'ready',
      renders: this.history.length,
    };
  }

  recentRenders(limit = 5): readonly RenderSummary[] {
    return this.history.slice(-limit).reverse();
  }

  private async handleRenderTask(
    task: TaskMessage<FrontendRenderTaskPayload>,
  ): Promise<TaskHandlerResult> {
    const { id: taskId, payload } = task;
    const resolved = this.registry.resolve(payload.slug);
    if (!resolved) {
      return {
        taskId,
        type: TaskType.RENDER_STATIC,
        status: 'failed',
        detail: `Unknown slug ${payload.slug}`,
      };
    }

    const viewer = payload.viewer ?? {};
    const rendered = await this.renderer.renderPage(resolved.manifest, {
      viewer: {
        id: viewer.id ?? null,
        roles: viewer.roles ?? [],
        attributes: viewer.attributes ?? {},
      },
      content: resolved.content,
      dataProvider: resolved.createHydrationProvider(),
    });

    this.history.push({
      taskId,
      slug: payload.slug,
      manifestVersion: rendered.manifest.version,
      generatedAt: new Date(rendered.manifest.generatedAt),
      bytes: rendered.html.length,
      hydratedTargets: rendered.hydration.subscriptions.map(
        (subscription) => subscription.targetId,
      ),
    });

    return {
      taskId,
      type: TaskType.RENDER_STATIC,
      status: 'completed',
      detail: `rendered ${payload.slug} (${rendered.html.length} bytes)`,
    };
  }
}
