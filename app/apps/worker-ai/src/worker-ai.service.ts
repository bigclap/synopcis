import { Injectable } from '@nestjs/common';
import { MarkdownRenderer, TaskMessage } from '@synop/shared-kernel';
import { randomUUID } from 'crypto';

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

type SuggestionsPayload = {
  phenomenonSlug: string;
  text: string;
};

@Injectable()
export class WorkerAiService {
  private readonly processed: AnalysisRecord[] = [];

  constructor(private readonly renderer: MarkdownRenderer) {}

  analyzeSource(task: TaskMessage<AnalysisPayload>) {
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
  }

  getAiSuggestions(task: TaskMessage<SuggestionsPayload>) {
    const payload = task.payload;
    const phenomena = ['apple', 'banana', 'orange'];
    const suggestions = phenomena
      .filter((phenomenon) => payload.text.includes(phenomenon))
      .map((phenomenon) => ({
        text: phenomenon,
        phenomenonSlug: phenomenon,
      }));

    return {
      taskId: task.id,
      type: task.type,
      status: 'completed',
      detail: `suggestions prepared for ${payload.phenomenonSlug}`,
      payload: suggestions,
    };
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
