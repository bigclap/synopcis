import { GitCommitInput } from '../integrations/git/git-repository.client';

export class GitInitDto {
  repository: string;
}

export class GitCommitDto extends GitCommitInput {}

export class GitReadFileDto {
  repository: string;
  filePath: string;
}
