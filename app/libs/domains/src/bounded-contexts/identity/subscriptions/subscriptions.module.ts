import { Module } from '@nestjs/common';
import { SubscriptionsDomainService } from './domain/subscriptions.service';

@Module({
  providers: [SubscriptionsDomainService],
  exports: [SubscriptionsDomainService],
})
export class SubscriptionsDomainModule {}
