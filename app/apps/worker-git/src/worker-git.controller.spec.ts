import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DomainsService } from '@synop/domains';
import {
  GitCommitRecord,
  LocalGitRepositoryClient,
  USERS_REPOSITORY,
  UsersRepository,
} from '@synop/shared-kernel';
import { WorkerGitController } from './worker-git.controller';
import { WorkerGitService } from './worker-git.service';

describe('WorkerGitController', () => {
  let controller: WorkerGitController;
  let domains: { registerWorker: jest.Mock };
  let git: jest.Mocked<LocalGitRepositoryClient>;
  let users: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    domains = {
      registerWorker: jest.fn().mockReturnValue(jest.fn()),
    };

    git = {
      commit: jest.fn(),
      history: jest.fn(),
    } as unknown as jest.Mocked<LocalGitRepositoryClient>;

    users = {
      findById: jest.fn(),
    } as jest.Mocked<UsersRepository>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkerGitController],
      providers: [
        WorkerGitService,
        { provide: DomainsService, useValue: domains },
        { provide: LocalGitRepositoryClient, useValue: git },
        { provide: USERS_REPOSITORY, useValue: users },
      ],
    }).compile();

    controller = module.get(WorkerGitController);
  });

  it('returns worker status payload', () => {
    expect(controller.health()).toEqual({ status: 'ready', commits: 0 });
  });

  it('rejects history queries without repository parameter', async () => {
    await expect(controller.history(undefined, undefined)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('updates a file through the service', async () => {
    const commit: GitCommitRecord = {
      repository: 'article-slug',
      hash: 'abc123',
      summary: 'Update intro',
      sourceUrl: 'https://example.com/source',
      files: [],
      author: { name: 'Alice', email: 'alice@example.com' },
      timestamp: new Date(),
    };

    git.commit.mockResolvedValue(commit);
    users.findById.mockResolvedValue({
      id: 'user-1',
      displayName: 'Alice',
      email: 'alice@example.com',
    });

    await expect(
      controller.updateFile({
        repository: 'article-slug',
        filePath: 'ru/b001-intro.md',
        content: '# Intro',
        summary: 'Update intro',
        sourceUrl: 'https://example.com/source',
        userId: 'user-1',
      }),
    ).resolves.toEqual({ status: 'committed', commit });

    expect(git.commit).toHaveBeenCalledWith({
      repository: 'article-slug',
      summary: 'Update intro',
      sourceUrl: 'https://example.com/source',
      author: { name: 'Alice', email: 'alice@example.com' },
      changes: { 'ru/b001-intro.md': '# Intro' },
      timestamp: undefined,
    });
  });
});
