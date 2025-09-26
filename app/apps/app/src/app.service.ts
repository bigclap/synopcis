import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { TaskProcessingError, TaskQueueService } from '@synop/shared-kernel';
import { Subscription } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private errorSubscription?: Subscription;
  private errorCount = 0;
  private lastError: TaskProcessingError | null = null;

  constructor(private readonly queue: TaskQueueService) {}

  onModuleInit(): void {
    this.errorSubscription = this.queue.errors().subscribe((error) => {
      this.errorCount += 1;
      this.lastError = error;
    });
  }

  onModuleDestroy(): void {
    this.errorSubscription?.unsubscribe();
  }

  status() {
    return {
      workers: this.queue.registeredConsumers(),
      errorCount: this.errorCount,
      lastError: this.lastError
        ? {
            taskId: this.lastError.task.id,
            type: this.lastError.task.type,
            message: this.lastError.error.message,
          }
        : null,
    };
  }
}
