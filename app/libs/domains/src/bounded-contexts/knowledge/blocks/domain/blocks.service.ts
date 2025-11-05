import { Inject, Injectable } from '@nestjs/common';
import type {
  BlockRepository,
  BlockAggregate,
  CreateBlockCommand,
  AddBlockAlternativeCommand,
  VoteForBlockAlternativeCommand,
  VerifyBlockSourceCommand,
} from './blocks.domain.entity';
import { BLOCK_REPOSITORY } from './blocks.domain.entity';

@Injectable()
export class BlocksDomainService {
  constructor(
    @Inject(BLOCK_REPOSITORY)
    private readonly repository: BlockRepository,
  ) {}

  async create(command: CreateBlockCommand): Promise<BlockAggregate> {
    // TODO: implement block creation logic
    throw new Error('BlocksDomainService.create not implemented');
  }

  async addAlternative(
    command: AddBlockAlternativeCommand,
  ): Promise<BlockAggregate> {
    // TODO: implement adding alternative logic
    throw new Error('BlocksDomainService.addAlternative not implemented');
  }

  async voteForAlternative(
    command: VoteForBlockAlternativeCommand,
  ): Promise<BlockAggregate> {
    // TODO: implement voting logic
    throw new Error('BlocksDomainService.voteForAlternative not implemented');
  }

  async verifySource(
    command: VerifyBlockSourceCommand,
  ): Promise<BlockAggregate> {
    // TODO: implement source verification logic
    throw new Error('BlocksDomainService.verifySource not implemented');
  }
}
