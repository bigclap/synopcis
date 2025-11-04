import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TaskType, TaskMessage } from '@synop/shared-kernel';
import { WorkerAiService } from './worker-ai.service';

type AnalysisPayload = {
  articleSlug: string;
  sourceUrl: string;
};

type SuggestionsPayload = {
  phenomenonSlug: string;
  text: string;
};

@Controller()
export class WorkerAiController {
  constructor(private readonly workerAiService: WorkerAiService) {}

  @Get('health')
  health() {
    return this.workerAiService.status();
  }

  @Get('recent')
  recent() {
    return this.workerAiService.recentAnalyses();
  }

  @MessagePattern(TaskType.ANALYZE_SOURCE)
  handleAnalyzeSource(@Payload() task: TaskMessage<AnalysisPayload>) {
    return this.workerAiService.analyzeSource(task);
  }

  @MessagePattern(TaskType.GET_AI_SUGGESTIONS)
  handleGetAiSuggestions(@Payload() task: TaskMessage<SuggestionsPayload>) {
    return this.workerAiService.getAiSuggestions(task);
  }
}
