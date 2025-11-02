import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LocalGitRepositoryClient } from '@synop/shared-kernel';
import { PhenomenonEntity } from './phenomenon.entity';
import {
  PhenomenonStorageService,
  UpdatePhenomenonBlocksInput,
} from './phenomenon-storage.service';
import { NewBlockInput, PhenomenonManifest } from './phenomenon.types';
import * as path from 'path';

const mockGitClient = {
  initializeRepository: jest.fn(),
  readFile: jest.fn(),
  commit: jest.fn(),
};

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
          provide: LocalGitRepositoryClient,
          useValue: mockGitClient,
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

      expect(mockGitClient.initializeRepository).toHaveBeenCalledWith(
        phenomenonSlug,
      );
      expect(mockGitClient.commit).toHaveBeenCalled();
      const commitCall = mockGitClient.commit.mock.calls[0][0];
      const manifest = JSON.parse(commitCall.changes['manifest.json']);
      expect(manifest.structure.length).toBe(1);
      expect(Object.keys(manifest.blocks).length).toBe(1);
    });
  });

  describe('updatePhenomenonBlocks', () => {
    it('adds new blocks to an existing manifest', async () => {
      const initialManifest: PhenomenonManifest = {
        article_slug: phenomenonSlug,
        title: 'Test Phenomenon',
        last_updated: new Date().toISOString(),
        default_lang: 'en',
        structure: [],
        blocks: {},
      };
      mockGitClient.readFile.mockResolvedValue(
        JSON.stringify(initialManifest),
      );

      await service.updatePhenomenonBlocks(MOCK_INPUT);

      expect(mockGitClient.commit).toHaveBeenCalled();
      const commitCall = mockGitClient.commit.mock.calls[0][0];
      const manifest = JSON.parse(commitCall.changes['manifest.json']);
      expect(manifest.structure.length).toBe(1);
      expect(Object.keys(manifest.blocks).length).toBe(1);
    });
  });
});
