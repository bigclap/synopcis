import { CacheConfiguration, HydrationTarget } from './hydration.types';

export interface FrontendManifest {
  readonly version: string;
  readonly generatedAt: string;
  readonly layout: readonly ManifestBlock[];
  readonly hydrations: readonly HydrationTarget[];
  readonly metadata?: ManifestMetadata;
}

export interface ManifestMetadata {
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly tags: readonly string[];
}

export type ManifestBlock =
  | StaticManifestBlock
  | MarkdownManifestBlock
  | ComponentManifestBlock;

interface BaseManifestBlock {
  readonly id: string;
  readonly cache?: CacheConfiguration;
  readonly contentKey?: string;
}

export interface StaticManifestBlock extends BaseManifestBlock {
  readonly type: 'static';
  readonly htmlKey: string;
}

export interface MarkdownManifestBlock extends BaseManifestBlock {
  readonly type: 'markdown';
  readonly markdown?: string;
  readonly markdownKey?: string;
  readonly wrapper?: string;
}

export interface ComponentManifestBlock extends BaseManifestBlock {
  readonly type: 'component';
  readonly component: string;
  readonly props?: Record<string, unknown>;
  readonly hydrationId?: string;
  readonly placeholderHtml?: string;
  readonly placeholderKey?: string;
}

export interface RenderedBlock {
  readonly id: string;
  readonly type: ManifestBlock['type'];
  readonly html: string;
  readonly hydrationId?: string;
  readonly cache?: CacheConfiguration;
}

export interface RenderedPage {
  readonly manifest: Pick<FrontendManifest, 'version' | 'generatedAt'>;
  readonly html: string;
  readonly blocks: readonly RenderedBlock[];
  readonly hydration: HydrationPlan;
}

export interface HydrationPlan {
  readonly initialState: Record<string, unknown>;
  readonly subscriptions: readonly HydrationSubscription[];
  readonly fallbackTargets: readonly string[];
}

export interface HydrationSubscription {
  readonly targetId: string;
  readonly transport: HydrationTransport;
  readonly endpoint: string;
  readonly description?: string;
  readonly refreshIntervalMs?: number;
  readonly cache?: CacheConfiguration & { readonly key?: string | null; readonly hit?: boolean };
}

export type HydrationTransport = 'polling' | 'sse' | 'websocket';

export interface RenderOptions {
  readonly viewer: ViewerContextInput;
  readonly content?: Record<string, string>;
  readonly dataProvider: HydrationDataProvider;
  readonly defaultHydrationIntervalMs?: number;
  readonly now?: Date;
}

import { ViewerContextInput } from './viewer.types';
import { HydrationDataProvider } from './hydration.types';
