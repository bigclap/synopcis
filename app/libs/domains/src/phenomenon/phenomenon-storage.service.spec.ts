import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { TaskType } from '@synop/shared-kernel';
import { PhenomenonEntity } from './phenomenon.entity';
import {
  PhenomenonStorageService,
  UpdatePhenomenonBlocksInput,
} from './phenomenon-storage.service';
import { NewBlockInput, PhenomenonManifest } from './phenomenon.types';
import * as path from 'path';

import { of } from 'rxjs';

const mockNatsClient = {
  send: jest.fn((pattern, data) => {
    if (pattern === TaskType.GIT_READ_FILE) {
      return of(JSON.stringify(mockManifest));
    }
    return of(null);
  }),
};

let mockManifest: PhenomenonManifest;

const mockPhenomenonRepository = {
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('PhenomenonStorageService', () => {
  let service: PhenomenonStorageService;

  const phenomenonSlug = 'test-phenomenon';

  const MOCK_BLOCK: NewBlockInput = {
    type: 'text',
    lang: 'en',
    level: 2,
    content: 'This is a test block.',
    title: 'Test Block',
  };

  const MOCK_INPUT: UpdatePhenomenonBlocksInput = {
    phenomenonSlug,
    summary: 'Add content',
    sourceUrl: 'https://example.com/source',
    author: { name: 'Test Author' },
    blocks: [MOCK_BLOCK],
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PhenomenonStorageService,
        {
          provide: 'NATS_SERVICE',
          useValue: mockNatsClient,
        },
        {
          provide: getRepositoryToken(PhenomenonEntity),
          useValue: mockPhenomenonRepository,
        },
      ],
    }).compile();

    service = module.get(PhenomenonStorageService);
    jest.clearAllMocks();
  });

  describe('createPhenomenon', () => {
    it('initializes a repository and creates an initial manifest', async () => {
      mockPhenomenonRepository.findOneBy.mockResolvedValue(null);
      mockPhenomenonRepository.create.mockReturnValue({
        slug: phenomenonSlug,
        userId: 'test-user',
      });

      await service.createPhenomenon({
        slug: phenomenonSlug,
        title: 'Test Phenomenon',
        author: { name: 'Test Author' },
        userId: 'test-user',
      });

      expect(mockNatsClient.send).toHaveBeenCalledWith(
        TaskType.GIT_INIT,
        expect.any(Object),
      );
      expect(mockNatsClient.send).toHaveBeenCalledWith(
        TaskType.GIT_COMMIT,
        expect.any(Object),
      );
    });
  });

  describe('updatePhenomenonBlocks', () => {
    it('adds new blocks to an existing manifest', async () => {
      mockManifest = {
        article_slug: phenomenonSlug,
        title: 'Test Phenomenon',
        last_updated: new Date().toISOString(),
        default_lang: 'en',
        structure: [],
        blocks: {},
      };

      await service.updatePhenomenonBlocks(MOCK_INPUT);

      expect(mockNatsClient.send).toHaveBeenCalledWith(
        TaskType.GIT_COMMIT,
        expect.any(Object),
      );
    });
  });
});
