import { Injectable } from '@nestjs/common';
import { CreateTaskInput, TaskMessage, createTaskMessage } from './events';

@Injectable()
export class SharedKernelService {
  buildTaskMessage<TPayload>(
    input: CreateTaskInput<TPayload>,
  ): TaskMessage<TPayload> {
    return createTaskMessage(input);
  }
}
