import { Inject, Injectable } from '@nestjs/common';
import {
  HydrationCache,
  HydrationContext,
  HydrationTarget,
} from '../types/hydration.types';
import { HydrationPlan, HydrationSubscription } from '../types/manifest.types';
import { ViewerContext } from '../types/viewer.types';

export const HYDRATION_CACHE = Symbol('HYDRATION_CACHE');

@Injectable()
export class HydrationOrchestrator {
  constructor(@Inject(HYDRATION_CACHE) private readonly cache: HydrationCache) {}

  async buildPlan(
    targets: readonly HydrationTarget[],
    context: HydrationContext,
  ): Promise<HydrationPlan> {
    const initialState: Record<string, unknown> = {};
    const subscriptions: HydrationSubscription[] = [];
    const fallbackTargets: string[] = [];

    for (const target of targets) {
      const subscription = await this.resolveTarget(target, context, initialState, fallbackTargets);
      if (subscription) {
        subscriptions.push(subscription);
      }
    }

    return {
      initialState,
      subscriptions,
      fallbackTargets,
    };
  }

  private async resolveTarget(
    target: HydrationTarget,
    context: HydrationContext,
    initialState: Record<string, unknown>,
    fallbackTargets: string[],
  ): Promise<HydrationSubscription | null> {
    const viewer = context.viewer;

    if (target.requiresAuth && !viewer.isAuthenticated) {
      if (target.fallback !== undefined) {
        initialState[target.id] = target.fallback;
      }
      fallbackTargets.push(target.id);
      return this.createSubscription(target, null, false, context.defaultRefreshIntervalMs);
    }

    const cacheKey = this.buildCacheKey(target, viewer);
    let hit = false;
    let payload: unknown | undefined;

    if (cacheKey) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        payload = cached.value;
        hit = true;
      }
    }

    if (payload === undefined) {
      payload = await context.dataProvider.load(target, viewer);
      if (cacheKey && target.cache) {
        this.cache.set(cacheKey, payload, target.cache.ttlSeconds);
      }
    }

    if (payload !== undefined) {
      initialState[target.id] = payload;
    }

    return this.createSubscription(target, cacheKey, hit, context.defaultRefreshIntervalMs);
  }

  private createSubscription(
    target: HydrationTarget,
    cacheKey: string | null,
    hit: boolean,
    defaultRefresh: number,
  ): HydrationSubscription {
    return {
      targetId: target.id,
      transport: target.transport,
      endpoint: target.endpoint,
      description: target.description,
      refreshIntervalMs:
        target.transport === 'polling'
          ? target.refreshIntervalMs ?? defaultRefresh
          : undefined,
      cache: target.cache
        ? {
            ...target.cache,
            key: cacheKey,
            hit,
          }
        : undefined,
    };
  }

  private buildCacheKey(target: HydrationTarget, viewer: ViewerContext): string | null {
    if (!target.cache) {
      return null;
    }

    switch (target.cache.scope) {
      case 'global':
        return `${target.id}:global`;
      case 'anonymous':
        if (viewer.isAuthenticated) {
          return null;
        }
        return `${target.id}:anonymous`;
      case 'user':
        return viewer.id ? `${target.id}:user:${viewer.id}` : null;
      default:
        return null;
    }
  }
}
