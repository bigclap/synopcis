import { Inject, Injectable } from '@nestjs/common';
import {
  NOTIFICATION_REPOSITORY,
  MarkNotificationReadCommand,
  NotificationAggregate,
  NotificationRepository,
  ScheduleNotificationCommand,
} from './notifications.domain.entity';

@Injectable()
export class NotificationsDomainService {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: NotificationRepository,
  ) {}

  async schedule(
    command: ScheduleNotificationCommand,
  ): Promise<NotificationAggregate> {
    // TODO: implement notification scheduling logic
    throw new Error('NotificationsDomainService.schedule not implemented');
  }

  async markRead(
    command: MarkNotificationReadCommand,
  ): Promise<NotificationAggregate> {
    // TODO: implement notification mark as read logic
    throw new Error('NotificationsDomainService.markRead not implemented');
  }
}
