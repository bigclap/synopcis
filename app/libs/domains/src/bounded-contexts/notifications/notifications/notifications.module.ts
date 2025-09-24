import { Module } from '@nestjs/common';
import { NotificationsDomainService } from './domain/notifications.service';

@Module({
  providers: [NotificationsDomainService],
  exports: [NotificationsDomainService],
})
export class NotificationsDomainModule {}
