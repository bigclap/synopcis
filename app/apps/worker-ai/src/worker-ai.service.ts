import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DomainsService } from '@synop/domains';
import { MarkdownRenderer, TaskType } from '@synop/shared-kernel';

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
  private unregister?: () => void;
  private readonly processed: AnalysisRecord[] = [];

  constructor(
    private readonly domains: DomainsService,
    private readonly renderer: MarkdownRenderer,
  ) {}

  onModuleInit(): void {
    this.unregister = this.domains.registerWorker<AnalysisPayload>(
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
      'AI source analyzer',
    );
  }

  onModuleDestroy(): void {
    this.unregister?.();
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
