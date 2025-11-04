import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  formatBlockFilePath,
  GitCommitInput,
  LocalGitRepositoryClient,
} from '@synop/shared-kernel';
import { Repository } from 'typeorm';
import { PhenomenonBlockEntity } from './phenomenon-block.entity';
import { PhenomenonEntity } from './phenomenon.entity';
import {
  PhenomenonBlock,
  PhenomenonManifest,
  PhenomenonManifestEntry,
} from './phenomenon.types';

export interface UpdatePhenomenonBlocksInput
  extends Omit<GitCommitInput, 'changes' | 'repository'> {
  readonly phenomenonSlug: string;
  readonly blocks: PhenomenonBlock[];
}

const MANIFEST_FILE_PATH = 'manifest.json';

@Injectable()
export class PhenomenonStorageService {
  constructor(
    private readonly git: LocalGitRepositoryClient,
    @InjectRepository(PhenomenonEntity)
    private readonly phenomenonRepository: Repository<PhenomenonEntity>,
    @InjectRepository(PhenomenonBlockEntity)
    private readonly blockRepository: Repository<PhenomenonBlockEntity>,
  ) {}

  async createPhenomenon(phenomenonSlug: string) {
    const manifest: PhenomenonManifest = {
      structure: [],
      blocks: {},
    };

    return this.git.commit({
      repository: phenomenonSlug,
      author: {
        name: 'System',
        email: 'system@synop.city',
      },
      summary: 'Initial commit',
      changes: {
        [MANIFEST_FILE_PATH]: JSON.stringify(manifest, null, 2),
      },
    });
  }

  async updatePhenomenonBlocks(input: UpdatePhenomenonBlocksInput) {
    const phenomenon = await this.findOrCreatePhenomenon(input.phenomenonSlug);
    const manifest = await this.loadManifest(input.phenomenonSlug);
    const manifestByPath = new Map(manifest.map((entry) => [entry.path, entry]));

    const changes: Record<string, string> = {};

    for (const block of input.blocks) {
      const filePath = formatBlockFilePath(block);
      changes[filePath] = block.content;

      const manifestEntry: PhenomenonManifestEntry = {
        path: filePath,
        title: block.title,
        level: block.level,
      };
      manifestByPath.set(filePath, manifestEntry);

      await this.upsertBlock(phenomenon, manifestEntry);
    }

    const updatedManifest = Array.from(manifestByPath.values());
    changes[MANIFEST_FILE_PATH] = JSON.stringify(updatedManifest, null, 2);

    return this.git.commit({
      repository: input.phenomenonSlug,
      ...input,
      changes,
    });
  }

  private async findOrCreatePhenomenon(slug: string): Promise<PhenomenonEntity> {
    let phenomenon = await this.phenomenonRepository.findOneBy({ slug });
    if (!phenomenon) {
      phenomenon = this.phenomenonRepository.create({ slug });
      await this.phenomenonRepository.save(phenomenon);
    }
    return phenomenon;
  }

  private async upsertBlock(
    phenomenon: PhenomenonEntity,
    entry: PhenomenonManifestEntry,
  ) {
    let block = await this.blockRepository.findOneBy({
      phenomenon: { id: phenomenon.id },
      path: entry.path,
    });

    if (block) {
      block.title = entry.title;
      block.level = entry.level;
    } else {
      block = this.blockRepository.create({
        phenomenon,
        path: entry.path,
        title: entry.title,
        level: entry.level,
      });
    }

    await this.blockRepository.save(block);
  }

  private async loadManifest(repository: string): Promise<PhenomenonManifest> {
    const content = await this.git.readFile(repository, MANIFEST_FILE_PATH);
    if (!content) {
      return [];
    }
    try {
      return JSON.parse(content);
    } catch {
      return [];
    }
  }
}
