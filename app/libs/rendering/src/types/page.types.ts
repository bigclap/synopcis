import { FrontendManifest } from './manifest.types';
import { HydrationDataProvider } from './hydration.types';

export interface PageMetadata {
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly tags: readonly string[];
}

export interface PageDefinition {
  readonly slug: string;
  readonly metadata: PageMetadata;
  readonly manifestFactory: () => FrontendManifest;
  readonly contentFactory: () => Record<string, string>;
  readonly hydrationFactory: () => HydrationDataProvider;
}

export interface ResolvedPageDefinition {
  readonly metadata: PageMetadata;
  readonly manifest: FrontendManifest;
  readonly content: Record<string, string>;
  readonly createHydrationProvider: () => HydrationDataProvider;
}
