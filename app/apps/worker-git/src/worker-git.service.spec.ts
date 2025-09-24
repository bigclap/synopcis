import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DomainsService } from '@synop/domains';
import {
  GitCommitRecord,
  LocalGitRepositoryClient,
  TaskMessage,
  TaskType,
  USERS_REPOSITORY,
  UsersRepository,
} from '@synop/shared-kernel';
import { MirrorGitPayload, WorkerGitService } from './worker-git.service';

describe('WorkerGitService', () => {
  let service: WorkerGitService;
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

    const moduleRef = await Test.createTestingModule({
      providers: [
        WorkerGitService,
        { provide: DomainsService, useValue: domains },
        { provide: LocalGitRepositoryClient, useValue: git },
        { provide: USERS_REPOSITORY, useValue: users },
      ],
    }).compile();

    service = moduleRef.get(WorkerGitService);
  });

  it('registers a git mirror worker on init and processes tasks', async () => {
    const unregister = jest.fn();
    domains.registerWorker.mockReturnValue(unregister);

    service.onModuleInit();

    expect(domains.registerWorker).toHaveBeenCalledWith(
      TaskType.MIRROR_GIT,
      expect.any(Function),
      'Git repository updater',
    );

    const handler = domains.registerWorker.mock.calls[0][1] as (
      task: TaskMessage<MirrorGitPayload>,
    ) => Promise<unknown>;

    const commit: GitCommitRecord = {
      repository: 'article',
      hash: 'hash',
      summary: 'Update block',
      sourceUrl: 'https://example.com',
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

    const task: TaskMessage<MirrorGitPayload> = {
      id: 'task-1',
      type: TaskType.MIRROR_GIT,
      createdAt: new Date(),
      priority: 'normal',
      payload: {
        repository: 'article',
        filePath: 'ru/b001-intro.md',
        content: '# Intro',
        summary: 'Update block',
        sourceUrl: 'https://example.com',
        userId: 'user-1',
        timestamp: new Date().toISOString(),
      },
    };

    await expect(handler(task)).resolves.toEqual({
      taskId: 'task-1',
      type: TaskType.MIRROR_GIT,
      status: 'completed',
      detail: 'committed hash to article',
    });

    expect(users.findById).toHaveBeenCalledWith('user-1');
    expect(git.commit).toHaveBeenCalledWith({
      repository: 'article',
      summary: 'Update block',
      sourceUrl: 'https://example.com',
      author: { name: 'Alice', email: 'alice@example.com' },
      changes: { 'ru/b001-intro.md': '# Intro' },
      timestamp: expect.any(Date),
    });

    expect(service.status()).toEqual({ status: 'ready', commits: 1 });

    service.onModuleDestroy();
    expect(unregister).toHaveBeenCalled();
  });

  it('commits file changes for an existing user', async () => {
    const commit: GitCommitRecord = {
      repository: 'article',
      hash: 'hash',
      summary: 'Update block',
      sourceUrl: 'https://example.com',
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

    const result = await service.updateFile({
      repository: 'article',
      filePath: 'ru/b001-intro.md',
      content: '# Intro',
      summary: 'Update block',
      sourceUrl: 'https://example.com',
      userId: 'user-1',
    });

    expect(result).toBe(commit);
    expect(git.commit).toHaveBeenCalledWith({
      repository: 'article',
      summary: 'Update block',
      sourceUrl: 'https://example.com',
      author: { name: 'Alice', email: 'alice@example.com' },
      changes: { 'ru/b001-intro.md': '# Intro' },
      timestamp: undefined,
    });
  });

  it('throws when the user cannot be found', async () => {
    users.findById.mockResolvedValue(null);

    await expect(
      service.updateFile({
        repository: 'article',
        filePath: 'ru/b001-intro.md',
        content: '# Intro',
        summary: 'Update block',
        sourceUrl: 'https://example.com',
        userId: 'missing-user',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(git.commit).not.toHaveBeenCalled();
  });
});
