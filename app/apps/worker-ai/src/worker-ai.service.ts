import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MarkdownRenderer, TaskQueueService, TaskType } from '@synop/shared-kernel';
import { Subscription } from 'rxjs';

type AnalysisPayload = {
  articleSlug: string;
  sourceUrl: string;
};

type AnalysisRecord = {
  id: string;
  articleSlug: string;
  renderedSummary: string;
  completedAt: Date;
};

@Injectable()
export class WorkerAiService implements OnModuleInit, OnModuleDestroy {
  private subscription?: Subscription;
  private readonly processed: AnalysisRecord[] = [];

  constructor(
    private readonly queue: TaskQueueService,
    private readonly renderer: MarkdownRenderer,
  ) {}

  onModuleInit(): void {
    this.subscription = this.queue.consume<AnalysisPayload>(
      TaskType.ANALYZE_SOURCE,
      async (task) => {
        const payload = task.payload;
        const renderedSummary = this.renderer.render(
          `# AI analysis for ${payload.articleSlug}\n\nSource: ${payload.sourceUrl}`,
        );

        this.processed.push({
          id: task.id,
          articleSlug: payload.articleSlug,
          renderedSummary,
          completedAt: new Date(),
        });

        return {
          taskId: task.id,
          type: task.type,
          status: 'completed',
          detail: `analysis prepared for ${payload.articleSlug}`,
        };
      },
      { description: 'AI source analyzer' },
    );
  }

  onModuleDestroy(): void {
    this.subscription?.unsubscribe();
  }

  status() {
    return {
      status: 'ready',
      processed: this.processed.length,
    };
  }

  recentAnalyses(limit = 5): AnalysisRecord[] {
    return this.processed.slice(-limit).reverse();
  }
}
