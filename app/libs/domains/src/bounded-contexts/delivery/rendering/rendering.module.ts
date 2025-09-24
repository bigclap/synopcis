import { Module } from '@nestjs/common';
import { RenderingDomainService } from './domain/rendering.service';

@Module({
  providers: [RenderingDomainService],
  exports: [RenderingDomainService],
})
export class RenderingDomainModule {}
