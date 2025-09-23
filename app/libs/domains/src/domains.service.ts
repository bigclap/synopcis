import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  CreateTaskInput,
  SharedKernelService,
  TaskHandlerResult,
  TaskMessage,
  TaskQueueService,
  TaskType,
} from '@synop/shared-kernel';
import { Subscription } from 'rxjs';

export type WorkerHandler<TPayload> = (
  task: TaskMessage<TPayload>,
) => Promise<TaskHandlerResult> | TaskHandlerResult;

@Injectable()
export class DomainsService implements OnModuleDestroy {
  private readonly subscriptions = new Map<TaskType, Subscription>();

  constructor(
    private readonly sharedKernel: SharedKernelService,
    private readonly queue: TaskQueueService,
  ) {}

  async publishTask<TPayload>(
    input: CreateTaskInput<TPayload>,
  ): Promise<TaskMessage<TPayload>> {
    const message = this.sharedKernel.buildTaskMessage(input);
    this.queue.publish(message);
    return message;
  }

  registerWorker<TPayload>(
    type: TaskType,
    handler: WorkerHandler<TPayload>,
    description?: string,
  ): () => void {
    if (this.subscriptions.has(type)) {
      throw new Error(`Handler for task ${type} already registered`);
    }

    const subscription = this.queue.consume(
      type,
      async (task) => handler(task),
      { description },
    );
    this.subscriptions.set(type, subscription);

    return () => {
      subscription.unsubscribe();
      this.subscriptions.delete(type);
    };
  }

  registeredWorkers(): TaskType[] {
    return Array.from(this.subscriptions.keys());
  }

  onModuleDestroy(): void {
    for (const subscription of this.subscriptions.values()) {
      subscription.unsubscribe();
    }
    this.subscriptions.clear();
  }
}
