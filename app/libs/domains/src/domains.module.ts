import { Module } from '@nestjs/common';
import { SharedKernelModule } from '@synop/shared-kernel';
import { DomainsService } from './domains.service';

@Module({
  imports: [SharedKernelModule],
  providers: [DomainsService],
  exports: [DomainsService],
})
export class DomainsModule {}
