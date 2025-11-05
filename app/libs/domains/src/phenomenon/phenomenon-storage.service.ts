import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GitAuthor,
  GitCommitInput,
  slugifyBlockLabel,
  TaskType,
  createTaskMessage,
} from '@synop/shared-kernel';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { PhenomenonEntity } from './phenomenon.entity';
import {
  NewBlockInput,
  PhenomenonManifest,
  BlockAlternative,
  BlockCatalogEntry,
} from './phenomenon.types';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface UpdatePhenomenonBlocksInput
  extends Omit<GitCommitInput, 'changes' | 'repository'> {
  readonly phenomenonSlug: string;
  readonly blocks: NewBlockInput[];
}

export interface CreatePhenomenonInput {
  readonly slug: string;
  readonly title: string;
  readonly author: GitAuthor;
  readonly userId: string;
}

const MANIFEST_FILE_PATH = 'manifest.json';

@Injectable()
export class PhenomenonStorageService {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
    @InjectRepository(PhenomenonEntity)
    private readonly phenomenonRepository: Repository<PhenomenonEntity>,
  ) {}

  async createPhenomenon(
    input: CreatePhenomenonInput,
  ): Promise<PhenomenonEntity> {
    await lastValueFrom(
      this.natsClient.send(
        TaskType.GIT_INIT,
        createTaskMessage({
          type: TaskType.GIT_INIT,
          payload: { repository: input.slug },
        }),
      ),
    );

    const phenomenon = await this.findOrCreatePhenomenon(
      input.slug,
      input.userId,
    );

    const blockId = `b${uuidv4().slice(0, 3)}`;
    const titleBlock: NewBlockInput = {
      type: 'heading',
      lang: 'en',
      level: 1,
      content: `# ${input.title.trim()}`,
      title: input.title,
    };

    const manifest: PhenomenonManifest = {
      article_slug: input.slug,
      title: input.title,
      last_updated: new Date().toISOString(),
      default_lang: 'en',
      structure: [{ block_id: blockId, level: 1 }],
      blocks: {},
    };

    const changes = this.addBlockToManifest(manifest, blockId, titleBlock);

    await lastValueFrom(
      this.natsClient.send(
        TaskType.GIT_COMMIT,
        createTaskMessage({
          type: TaskType.GIT_COMMIT,
          payload: {
            repository: input.slug,
            author: input.author,
            summary: 'Initial commit',
            sourceUrl: 'synop://kernel.synop.one/init',
            changes,
          },
        }),
      ),
    );

    return phenomenon;
  }

  async updatePhenomenonBlocks(input: UpdatePhenomenonBlocksInput) {
    const manifest = await this.loadManifest(input.phenomenonSlug);
    if (!manifest) {
      throw new Error(
        `Manifest for phenomenon "${input.phenomenonSlug}" not found.`,
      );
    }

    let changes: Record<string, string> = {};

    for (const block of input.blocks) {
      const blockId = `b${uuidv4().slice(0, 3)}`;
      manifest.structure.push({ block_id: blockId, level: block.level });
      const blockChanges = this.addBlockToManifest(manifest, blockId, block);
      changes = { ...changes, ...blockChanges };
    }

    return lastValueFrom(
      this.natsClient.send(
        TaskType.GIT_COMMIT,
        createTaskMessage({
          type: TaskType.GIT_COMMIT,
          payload: {
            repository: input.phenomenonSlug,
            ...input,
            changes,
          },
        }),
      ),
    );
  }

  private async findOrCreatePhenomenon(
    slug: string,
    userId: string,
  ): Promise<PhenomenonEntity> {
    let phenomenon = await this.phenomenonRepository.findOneBy({ slug });
    if (!phenomenon) {
      phenomenon = this.phenomenonRepository.create({ slug, userId });
      await this.phenomenonRepository.save(phenomenon);
    }
    return phenomenon;
  }

  private addBlockToManifest(
    manifest: PhenomenonManifest,
    blockId: string,
    block: NewBlockInput,
  ): Record<string, string> {
    const safeTitle = slugifyBlockLabel(block.title || block.type);
    const fileName = `${block.lang}/${blockId}-${safeTitle}.md`;
    const filePath = path.posix.join(fileName);

    const alternative: BlockAlternative = {
      file: filePath,
      lang: block.lang,
      votes: 0,
      concepts: block.concepts || [],
      source: block.source || null,
      trust_score: 0,
    };

    const catalogEntry: BlockCatalogEntry = {
      type: block.type,
      alternatives: [alternative],
    };

    manifest.blocks[blockId] = catalogEntry;
    manifest.last_updated = new Date().toISOString();

    const changes = {
      [filePath]: block.content,
      [MANIFEST_FILE_PATH]: JSON.stringify(manifest, null, 2),
    };

    return changes;
  }

  private async loadManifest(
    repository: string,
  ): Promise<PhenomenonManifest | null> {
    const content = await lastValueFrom(
      this.natsClient.send(
        TaskType.GIT_READ_FILE,
        createTaskMessage({
          type: TaskType.GIT_READ_FILE,
          payload: { repository, filePath: MANIFEST_FILE_PATH },
        }),
      ),
    );
    if (!content) {
      return null;
    }
    try {
      return JSON.parse(content);
    } catch {
      return null;
    }
  }
}
