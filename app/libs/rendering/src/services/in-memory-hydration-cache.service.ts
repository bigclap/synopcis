import { Injectable } from '@nestjs/common';
import { HydrationCache, HydrationCacheEntry } from '../types/hydration.types';

@Injectable()
export class InMemoryHydrationCache implements HydrationCache {
  private readonly store = new Map<string, HydrationCacheEntry>();

  get<T = unknown>(key: string): HydrationCacheEntry<T> | undefined {
    const entry = this.store.get(key);
    if (!entry) {
      return undefined;
    }

    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return undefined;
    }

    return entry as HydrationCacheEntry<T>;
  }

  set<T = unknown>(key: string, value: T, ttlSeconds: number): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(key, { value, expiresAt });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}
