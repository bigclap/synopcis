// Defines the structure for the source of a block's content.
export interface BlockSource {
  readonly type: 'web' | 'offline';
  readonly url?: string; // For web sources
  readonly identifier?: string; // For offline sources like ISBN, DOI
  readonly page?: string | number;
}

// Defines a single alternative version of a content block.
export interface BlockAlternative {
  readonly file: string;
  readonly lang: string;
  readonly votes: number;
  readonly concepts?: string[];
  readonly source: BlockSource | null;
  readonly trust_score: number;
}

// Defines an entry in the 'blocks' catalog of the manifest.
export interface BlockCatalogEntry {
  readonly type: 'heading' | 'text' | 'quote' | 'image' | 'property-card';
  readonly alternatives: BlockAlternative[];
}

// Defines an entry in the 'structure' array of the manifest.
export interface StructureEntry {
  readonly block_id: string;
  readonly level: number;
}

// Represents the entire manifest.json file.
export interface PhenomenonManifest {
  readonly article_slug: string;
  readonly title: string;
  readonly last_updated: string; // ISO 8601 date string
  readonly default_lang: string;
  readonly structure: StructureEntry[];
  readonly blocks: Record<string, BlockCatalogEntry>; // A dictionary of blocks, keyed by block_id
}

// Represents the input data needed to create a new content block from scratch.
// This is used by services before the block is fully integrated into the manifest.
export interface NewBlockInput {
  readonly type: BlockCatalogEntry['type'];
  readonly lang: string;
  readonly level: number;
  readonly content: string;
  readonly title?: string; // Often used for headings or to generate filenames
  readonly concepts?: string[];
  readonly source?: BlockSource;
}
