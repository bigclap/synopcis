import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhenomenonEntity } from './phenomenon.entity';
import { PhenomenonDomainService } from './phenomenon.domain.service';
import { PhenomenonBlockEntity } from './phenomenon-block.entity';
import { PhenomenonStorageService } from './phenomenon-storage.service';
import { LocalGitRepositoryClient } from '@synop/shared-kernel';

@Module({
  imports: [TypeOrmModule.forFeature([PhenomenonEntity, PhenomenonBlockEntity])],
  providers: [
    PhenomenonDomainService,
    PhenomenonStorageService,
    LocalGitRepositoryClient,
  ],
  exports: [PhenomenonDomainService, PhenomenonStorageService],
})
export class PhenomenonModule {}
