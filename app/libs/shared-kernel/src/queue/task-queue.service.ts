import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import {
  EMPTY,
  Observable,
  Subject,
  Subscription,
  catchError,
  concatMap,
  filter,
  from,
  tap,
} from 'rxjs';
import {
  TaskHandlerResult,
  TaskMessage,
  TaskProcessingError,
  TaskType,
} from '../events';

export type TaskHandler<TPayload = Record<string, unknown>> = (
  task: TaskMessage<TPayload>,
) => Promise<TaskHandlerResult | void> | TaskHandlerResult | void;

export interface ConsumeOptions {
  readonly description?: string;
}

export interface TaskConsumerDescriptor {
  readonly id: string;
  readonly type: TaskType;
  readonly description?: string;
  readonly registeredAt: Date;
}

interface RegisteredConsumer extends TaskConsumerDescriptor {
  readonly subscription: Subscription;
}

@Injectable()
export class TaskQueueService implements OnModuleDestroy {
  private readonly logger = new Logger(TaskQueueService.name);
  private readonly stream$ = new Subject<TaskMessage>();
  private readonly errors$ = new Subject<TaskProcessingError>();
  private readonly subscriptions = new Set<Subscription>();
  private readonly consumers = new Map<string, RegisteredConsumer>();
  private registrationSequence = 0;

  publish<TPayload>(task: TaskMessage<TPayload>): void {
    this.logger.debug(`Publishing task ${task.type} (${task.id})`);
    this.stream$.next(task);
  }

  onTask<TPayload>(type: TaskType): Observable<TaskMessage<TPayload>> {
    return this.stream$.pipe(filter((task) => task.type === type)) as Observable<
      TaskMessage<TPayload>
    >;
  }

  consume<TPayload>(
    type: TaskType,
    handler: TaskHandler<TPayload>,
    options?: ConsumeOptions,
  ): Subscription {
    const registrationId = this.createRegistrationId(type);
    const registeredAt = new Date();

    const subscription = this.onTask<TPayload>(type)
      .pipe(
        concatMap((task) =>
          from(Promise.resolve().then(() => handler(task))).pipe(
            tap((result) => {
              if (!result) {
                this.logger.log(
                  `Task ${task.id} (${task.type}) processed without explicit result`,
                );
                return;
              }

              if (result.status === 'failed') {
                const error = new Error(result.detail ?? 'Task failed');
                this.emitError(task, error);
                return;
              }

              this.logger.log(
                `Task ${result.taskId} (${result.type}) completed: ${
                  result.detail ?? 'ok'
                }`,
              );
            }),
            catchError((error) => {
              this.emitError(task, this.normalizeError(error));
              return EMPTY;
            }),
          ),
        ),
      )
      .subscribe();

    this.registerConsumer({
      id: registrationId,
      type,
      description: options?.description,
      registeredAt,
      subscription,
    });

    if (options?.description) {
      this.logger.log(
        `Registered handler for ${type} (${options.description})`,
      );
    } else {
      this.logger.log(`Registered handler for ${type}`);
    }

    this.subscriptions.add(subscription);
    subscription.add(() => {
      this.subscriptions.delete(subscription);
      this.unregisterConsumer(registrationId);
    });

    return subscription;
  }

  errors(): Observable<TaskProcessingError> {
    return this.errors$.asObservable();
  }

  registeredConsumers(): number {
    return this.consumers.size;
  }

  listConsumers(): TaskConsumerDescriptor[] {
    return Array.from(this.consumers.values()).map(
      ({ id, type, description, registeredAt }) => ({
        id,
        type,
        description,
        registeredAt,
      }),
    );
  }

  onModuleDestroy(): void {
    this.logger.log('Shutting down task queue');
    for (const subscription of Array.from(this.subscriptions.values())) {
      subscription.unsubscribe();
    }
    this.subscriptions.clear();
    this.consumers.clear();
    this.stream$.complete();
    this.errors$.complete();
  }

  private emitError(task: TaskMessage, error: Error): void {
    const payload: TaskProcessingError = {
      task,
      error,
    };

    this.logger.error(
      `Task ${task.id} (${task.type}) failed: ${error.message}`,
      error.stack,
    );
    this.errors$.next(payload);
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }

    if (typeof error === 'string') {
      return new Error(error);
    }

    return new Error(JSON.stringify(error));
  }

  private createRegistrationId(type: TaskType): string {
    this.registrationSequence += 1;
    return `${type}:${this.registrationSequence}`;
  }

  private registerConsumer(consumer: RegisteredConsumer): void {
    this.consumers.set(consumer.id, consumer);
  }

  private unregisterConsumer(registrationId: string): void {
    if (!this.consumers.has(registrationId)) {
      return;
    }

    this.logger.log(`Unregistered handler ${registrationId}`);
    this.consumers.delete(registrationId);
  }
}
