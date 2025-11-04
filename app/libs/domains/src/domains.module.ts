import { Module } from '@nestjs/common';
import { PhenomenonModule } from './phenomenon/phenomenon.module';
import { DomainsService } from './domains.service';
import { SharedKernelModule } from '@synop/shared-kernel';

@Module({
  imports: [SharedKernelModule, PhenomenonModule],
  providers: [DomainsService],
  exports: [DomainsService, PhenomenonModule],
})
export class DomainsModule {}
