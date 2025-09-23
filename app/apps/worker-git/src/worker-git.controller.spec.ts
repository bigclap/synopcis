import { Test, TestingModule } from '@nestjs/testing';
import { DomainsModule } from '@synop/domains';
import { WorkerGitController } from './worker-git.controller';
import { WorkerGitService } from './worker-git.service';

describe('WorkerGitController', () => {
  let controller: WorkerGitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DomainsModule],
      controllers: [WorkerGitController],
      providers: [WorkerGitService],
    }).compile();

    controller = module.get(WorkerGitController);
  });

  it('returns worker status payload', () => {
    expect(controller.health()).toEqual({ status: 'ready', commits: 0 });
  });
});
