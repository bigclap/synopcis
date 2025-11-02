import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  GitCommitRecord,
  InMemoryObjectStorageClient,
  LocalGitRepositoryClient,
  UserAccount,
  UsersRepository,
  USERS_REPOSITORY,
} from '@synop/shared-kernel';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as path from 'path';

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
  private readonly template: HandlebarsTemplateDelegate;

  constructor(
    private readonly git: LocalGitRepositoryClient,
    @Inject(USERS_REPOSITORY) private readonly users: UsersRepository,
    private readonly storage: InMemoryObjectStorageClient,
  ) {
    const templatePath = path.join(__dirname, 'templates', 'index.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    this.template = handlebars.compile(templateSource);
  }

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

    await this.generateStaticHtml(request.repository);

    return commit;
  }

  private async generateStaticHtml(repository: string): Promise<void> {
    const html = this.template({ title: repository });

    await this.storage.upload({
      bucket: 'pages',
      key: `${repository}/index.html`,
      body: Buffer.from(html),
      contentType: 'text/html',
    });
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
