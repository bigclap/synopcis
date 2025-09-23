import { randomUUID } from 'crypto';
import { TaskPriority, TaskType } from './task.types';

export interface TaskMessage<TPayload = Record<string, unknown>> {
  readonly id: string;
  readonly type: TaskType;
  readonly createdAt: Date;
  readonly priority: TaskPriority;
  readonly payload: TPayload;
  readonly correlationId?: string;
  readonly source?: string;
}

export interface CreateTaskInput<TPayload = Record<string, unknown>> {
  readonly type: TaskType;
  readonly payload: TPayload;
  readonly priority?: TaskPriority;
  readonly correlationId?: string;
  readonly source?: string;
  readonly id?: string;
  readonly createdAt?: Date;
}

export interface TaskHandlerResult {
  readonly taskId: string;
  readonly type: TaskType;
  readonly status: 'completed' | 'failed';
  readonly detail?: string;
}

export interface TaskProcessingError {
  readonly task: TaskMessage;
  readonly error: Error;
}

export function createTaskMessage<TPayload>(
  input: CreateTaskInput<TPayload>,
): TaskMessage<TPayload> {
  return {
    id: input.id ?? randomUUID(),
    type: input.type,
    createdAt: input.createdAt ?? new Date(),
    priority: input.priority ?? 'normal',
    payload: input.payload,
    correlationId: input.correlationId,
    source: input.source,
  };
}
