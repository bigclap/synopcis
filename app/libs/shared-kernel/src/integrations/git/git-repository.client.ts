import { Injectable } from '@nestjs/common';

type FilePath = string;

type CommitHash = string;

type FileContent = string;

export interface CommitInput {
  readonly message: string;
  readonly author: string;
  readonly timestamp?: Date;
  readonly changes: Record<FilePath, FileContent>;
}

export interface CommitRecord extends CommitInput {
  readonly hash: CommitHash;
}

@Injectable()
export class InMemoryGitRepositoryClient {
  private readonly files = new Map<FilePath, FileContent>();
  private readonly commits: CommitRecord[] = [];

  async commit(input: CommitInput): Promise<CommitRecord> {
    for (const [path, content] of Object.entries(input.changes)) {
      this.files.set(path, content);
    }

    const record: CommitRecord = {
      ...input,
      timestamp: input.timestamp ?? new Date(),
      hash: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    };
    this.commits.push(record);
    return record;
  }

  async readFile(path: FilePath): Promise<FileContent | null> {
    return this.files.get(path) ?? null;
  }

  async history(limit = 10): Promise<CommitRecord[]> {
    return this.commits.slice(-limit).reverse();
  }
}
