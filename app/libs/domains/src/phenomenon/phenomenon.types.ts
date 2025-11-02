export interface PhenomenonBlock {
  readonly lang: string;
  readonly blockId: number;
  readonly label: string;
  readonly title: string;
  readonly level: number;
  readonly content: string;
}

export interface PhenomenonManifestEntry {
  readonly path: string;
  readonly title: string;
  readonly level: number;
}

export type PhenomenonManifest = PhenomenonManifestEntry[];
