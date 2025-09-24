import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  GitCommitRecord,
  LocalGitRepositoryClient,
  UserAccount,
  UsersRepository,
  USERS_REPOSITORY,
} from '@synop/shared-kernel';

export interface UpdateFileRequest {
  readonly repository: string;
  readonly filePath: string;
  readonly content: string;
  readonly summary: string;
  readonly sourceUrl: string;
  readonly userId: string;
  readonly timestamp?: Date;
}

@Injectable()
export class WorkerGitService {
  private commitCount = 0;

  constructor(
    private readonly git: LocalGitRepositoryClient,
    @Inject(USERS_REPOSITORY) private readonly users: UsersRepository,
  ) {}

  async updateFile(request: UpdateFileRequest): Promise<GitCommitRecord> {
    const author = await this.loadAuthor(request.userId);

    const commit = await this.git.commit({
      repository: request.repository,
      summary: request.summary,
      sourceUrl: request.sourceUrl,
      author: {
        name: author.displayName,
        email: author.email ?? undefined,
      },
      changes: {
        [request.filePath]: request.content,
      },
      timestamp: request.timestamp,
    });

    this.commitCount += 1;
    return commit;
  }

  status() {
    return {
      status: 'ready',
      commits: this.commitCount,
    };
  }

  history(repository: string, limit = 5): Promise<GitCommitRecord[]> {
    return this.git.history(repository, limit);
  }

  private async loadAuthor(userId: string): Promise<UserAccount> {
    const author = await this.users.findById(userId);
    if (!author) {
      throw new NotFoundException(`User with id ${userId} was not found`);
    }

    return author;
  }
}
