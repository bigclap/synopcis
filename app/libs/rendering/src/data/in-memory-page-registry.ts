import { ManifestBlock } from '../types/manifest.types';
import {
  HydrationDataProvider,
  HydrationTarget,
} from '../types/hydration.types';
import {
  PageDefinition,
  PageMetadata,
  ResolvedPageDefinition,
} from '../types/page.types';
import { ViewerContext } from '../types/viewer.types';

interface VoteDataset {
  readonly total: number;
  readonly delta: { readonly lastHour: number; readonly lastDay: number };
  readonly breakdown: { readonly up: number; readonly down: number };
  readonly perUser: Record<string, number>;
  readonly history: readonly { readonly timestamp: string; readonly total: number }[];
}

interface CommentRecord {
  readonly id: string;
  readonly authorId: string;
  readonly authorHandle: string;
  readonly postedAt: string;
  readonly message: string;
  readonly score: number;
  readonly replies: number;
}

interface CommentPreview {
  readonly id: string;
  readonly authorHandle: string;
  readonly excerpt: string;
  readonly postedAt: string;
}

interface AlternativeRecord {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly votes: number;
  readonly confidence: number;
}

interface HydrationDataset {
  readonly votes: VoteDataset;
  readonly comments: {
    readonly full: readonly CommentRecord[];
    readonly preview: readonly CommentPreview[];
  };
  readonly alternatives: readonly AlternativeRecord[];
}

class InMemoryHydrationProvider implements HydrationDataProvider {
  constructor(private readonly dataset: HydrationDataset) {}

  async load(target: HydrationTarget, viewer: ViewerContext): Promise<unknown> {
    switch (target.id) {
      case 'votes':
        return this.loadVotes(viewer);
      case 'alternatives':
        return this.loadAlternatives();
      case 'comments':
        return this.loadComments(viewer);
      default:
        throw new Error(`Unknown hydration target ${target.id}`);
    }
  }

  private loadVotes(viewer: ViewerContext) {
    const userVote = viewer.isAuthenticated
      ? this.dataset.votes.perUser[viewer.id ?? ''] ?? 0
      : 0;

    return {
      total: this.dataset.votes.total,
      delta: this.dataset.votes.delta,
      breakdown: this.dataset.votes.breakdown,
      userVote,
      history: this.dataset.votes.history.map((point) => ({ ...point })),
      refreshedAt: new Date().toISOString(),
    };
  }

  private loadAlternatives() {
    return {
      items: this.dataset.alternatives.map((alternative) => ({ ...alternative })),
      refreshedAt: new Date().toISOString(),
    };
  }

  private loadComments(viewer: ViewerContext) {
    return {
      total: this.dataset.comments.full.length,
      items: this.dataset.comments.full.map((comment) => ({
        id: comment.id,
        authorHandle: comment.authorHandle,
        postedAt: comment.postedAt,
        message: comment.message,
        score: comment.score,
        replies: comment.replies,
        permissions: {
          canEdit: viewer.id === comment.authorId,
          canModerate: viewer.roles.includes('moderator'),
          canReact: viewer.isAuthenticated,
        },
      })),
      refreshedAt: new Date().toISOString(),
    };
  }
}

export class InMemoryPageRegistry {
  private readonly pages = new Map<string, PageDefinition>();

  constructor(definitions: readonly PageDefinition[]) {
    for (const definition of definitions) {
      this.pages.set(definition.slug, definition);
    }
  }

  resolve(slug: string): ResolvedPageDefinition | null {
    const definition = this.pages.get(slug);
    if (!definition) {
      return null;
    }

    const manifest = definition.manifestFactory();
    return {
      metadata: definition.metadata,
      manifest,
      content: definition.contentFactory(),
      createHydrationProvider: () => definition.hydrationFactory(),
    };
  }

  listMetadata(): readonly PageMetadata[] {
    return Array.from(this.pages.values()).map((definition) => definition.metadata);
  }
}

export function createDemoPageRegistry(): InMemoryPageRegistry {
  const metadata: PageMetadata = {
    slug: 'relativity',
    title: 'General Relativity: Curving Spacetime',
    summary:
      'A high-level walkthrough of how mass and energy distort spacetime, creating the gravitational effects we observe.',
    tags: ['physics', 'cosmology', 'spacetime'],
  };

  const markdown = `# Bending the rules of gravity\n\nGeneral relativity replaces the Newtonian force of gravity with geometry.\n\n* Mass tells spacetime how to curve.\n* Curved spacetime tells mass how to move.\n\nThe Einstein field equations connect matter and geometry:\n\n\\[G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = 8\\pi T_{\\mu\\nu}\\]`;

  const hydrationDataset: HydrationDataset = {
    votes: {
      total: 421,
      delta: { lastHour: 4, lastDay: 26 },
      breakdown: { up: 389, down: 32 },
      perUser: {
        'user-1': 1,
        'user-17': 1,
        'user-42': -1,
      },
      history: [
        { timestamp: '2025-01-01T08:00:00.000Z', total: 390 },
        { timestamp: '2025-01-02T08:00:00.000Z', total: 401 },
        { timestamp: '2025-01-03T08:00:00.000Z', total: 409 },
        { timestamp: '2025-01-04T08:00:00.000Z', total: 416 },
        { timestamp: '2025-01-05T08:00:00.000Z', total: 421 },
      ],
    },
    comments: {
      full: [
        {
          id: 'c1',
          authorId: 'user-42',
          authorHandle: 'niels.b',
          postedAt: '2025-01-05T12:22:00.000Z',
          message:
            'Love how the summary connects curvature with orbital motion. A quick mention of the Schwarzschild solution would make it perfect.',
          score: 12,
          replies: 1,
        },
        {
          id: 'c2',
          authorId: 'user-17',
          authorHandle: 'marie.c',
          postedAt: '2025-01-05T18:40:00.000Z',
          message: 'Could we add a section on experimental confirmations like gravitational lensing?',
          score: 9,
          replies: 0,
        },
        {
          id: 'c3',
          authorId: 'user-1',
          authorHandle: 'ada.l',
          postedAt: '2025-01-06T07:15:00.000Z',
          message:
            'Fantastic overview. I would link to the tensor calculus primer for readers new to the math.',
          score: 6,
          replies: 3,
        },
      ],
      preview: [
        {
          id: 'c1',
          authorHandle: 'niels.b',
          excerpt:
            'Love how the summary connects curvature with orbital motion…',
          postedAt: '2025-01-05T12:22:00.000Z',
        },
        {
          id: 'c2',
          authorHandle: 'marie.c',
          excerpt: 'Could we add a section on experimental confirmations…',
          postedAt: '2025-01-05T18:40:00.000Z',
        },
      ],
    },
    alternatives: [
      {
        id: 'alt-1',
        title: 'Frame-dragging visual walkthrough',
        summary: 'Animated explanation that focuses on how rotating bodies twist spacetime.',
        votes: 112,
        confidence: 0.74,
      },
      {
        id: 'alt-2',
        title: 'Gravity without tensors',
        summary: 'A concept card that derives gravitational time dilation using only thought experiments.',
        votes: 98,
        confidence: 0.68,
      },
      {
        id: 'alt-3',
        title: 'Quantum gravity comparison',
        summary: 'Contrasts general relativity predictions with leading loop and string approaches.',
        votes: 64,
        confidence: 0.55,
      },
    ],
  };

  const baseLayout: ManifestBlock[] = [
    {
      id: 'hero',
      type: 'static',
      htmlKey: 'hero',
    },
    {
      id: 'vote-panel',
      type: 'component',
      component: 'VotePanel',
      hydrationId: 'votes',
      placeholderKey: 'placeholder.votes',
      props: { orientation: 'horizontal', aggregateOnly: false },
    },
    {
      id: 'article-body',
      type: 'markdown',
      markdownKey: 'article.markdown',
      wrapper: 'article',
    },
    {
      id: 'alternatives',
      type: 'component',
      component: 'AlternativeList',
      hydrationId: 'alternatives',
      placeholderKey: 'placeholder.alternatives',
      props: { layout: 'grid', columns: 3 },
    },
    {
      id: 'comments',
      type: 'component',
      component: 'CommentStream',
      hydrationId: 'comments',
      placeholderKey: 'placeholder.comments',
      props: { threaded: true, realtime: true },
    },
  ];

  const baseHydrations: HydrationTarget[] = [
    {
      id: 'votes',
      endpoint: '/api/v1/articles/relativity/votes',
      transport: 'polling',
      description: 'Vote totals and viewer state',
      refreshIntervalMs: 12_000,
      cache: { scope: 'user', ttlSeconds: 10 },
    },
    {
      id: 'alternatives',
      endpoint: '/api/v1/articles/relativity/alternatives',
      transport: 'polling',
      description: 'Suggested alternative explanations',
      refreshIntervalMs: 20_000,
      cache: { scope: 'global', ttlSeconds: 45 },
    },
    {
      id: 'comments',
      endpoint: '/api/v1/articles/relativity/comments',
      transport: 'sse',
      description: 'Live discussion stream',
      cache: { scope: 'user', ttlSeconds: 5 },
      requiresAuth: true,
      fallback: hydrationDataset.comments.preview.map((item) => ({ ...item })),
    },
  ];

  const definition: PageDefinition = {
    slug: metadata.slug,
    metadata,
    manifestFactory: () => ({
      version: '0.1.0',
      generatedAt: new Date().toISOString(),
      layout: baseLayout.map((block) => ({ ...block })),
      hydrations: baseHydrations.map((target) => ({
        ...target,
        fallback:
          target.fallback !== undefined
            ? JSON.parse(JSON.stringify(target.fallback))
            : undefined,
      })),
      metadata,
    }),
    contentFactory: () => {
      const tags = metadata.tags
        .map((tag) => `<span class="tag">${tag}</span>`)
        .join('');

      return {
        hero: `<section class="hero"><h1>${metadata.title}</h1><p>${metadata.summary}</p><div class="tags">${tags}</div></section>`,
        'article.markdown': markdown,
        'placeholder.votes':
          '<div class="skeleton skeleton--votes">Vote totals are loading…</div>',
        'placeholder.alternatives':
          '<div class="skeleton skeleton--alternatives">Fetching alternatives…</div>',
        'placeholder.comments':
          '<div class="skeleton skeleton--comments">Loading discussion…</div>',
      };
    },
    hydrationFactory: () => new InMemoryHydrationProvider(hydrationDataset),
  };

  return new InMemoryPageRegistry([definition]);
}
