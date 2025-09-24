import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  GitCommitRecord,
  LocalGitRepositoryClient,
  USERS_REPOSITORY,
  UsersRepository,
} from '@synop/shared-kernel';
import { WorkerGitService } from './worker-git.service';

describe('WorkerGitService', () => {
  let service: WorkerGitService;
  let git: jest.Mocked<LocalGitRepositoryClient>;
  let users: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
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
        { provide: LocalGitRepositoryClient, useValue: git },
        { provide: USERS_REPOSITORY, useValue: users },
      ],
    }).compile();

    service = moduleRef.get(WorkerGitService);
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

  it('increments commit count after each commit', async () => {
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

    expect(service.status()).toEqual({ status: 'ready', commits: 0 });

    await service.updateFile({
      repository: 'article',
      filePath: 'ru/b001-intro.md',
      content: '# Intro',
      summary: 'Update block',
      sourceUrl: 'https://example.com',
      userId: 'user-1',
    });

    expect(service.status()).toEqual({ status: 'ready', commits: 1 });
  });

  it('uses git history for the requested repository', async () => {
    const commit: GitCommitRecord = {
      repository: 'article',
      hash: 'hash',
      summary: 'Update block',
      sourceUrl: 'https://example.com',
      files: [],
      author: { name: 'Alice', email: 'alice@example.com' },
      timestamp: new Date(),
    };

    git.history.mockResolvedValue([commit]);

    await expect(service.history('article', 2)).resolves.toEqual([commit]);
    expect(git.history).toHaveBeenCalledWith('article', 2);
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
