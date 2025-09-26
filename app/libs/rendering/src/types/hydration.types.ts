import { ViewerContext } from './viewer.types';
import { HydrationTransport } from './manifest.types';

export type CacheScope = 'global' | 'anonymous' | 'user';

export interface CacheConfiguration {
  readonly scope: CacheScope;
  readonly ttlSeconds: number;
}

export interface HydrationTarget {
  readonly id: string;
  readonly endpoint: string;
  readonly transport: HydrationTransport;
  readonly description?: string;
  readonly refreshIntervalMs?: number;
  readonly cache?: CacheConfiguration;
  readonly requiresAuth?: boolean;
  readonly fallback?: unknown;
}

export interface HydrationDataProvider {
  load(target: HydrationTarget, viewer: ViewerContext): Promise<unknown>;
}

export interface HydrationCacheEntry<T = unknown> {
  readonly value: T;
  readonly expiresAt: number;
}

export interface HydrationCache {
  get<T = unknown>(key: string): HydrationCacheEntry<T> | undefined;
  set<T = unknown>(key: string, value: T, ttlSeconds: number): void;
  delete(key: string): void;
  clear(): void;
}

export interface HydrationContext {
  readonly viewer: ViewerContext;
  readonly dataProvider: HydrationDataProvider;
  readonly now: Date;
  readonly defaultRefreshIntervalMs: number;
}
