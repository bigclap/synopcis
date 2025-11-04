export enum TaskType {
  RENDER_STATIC = 'render.static',
  ANALYZE_SOURCE = 'analyze.source',
  MIRROR_GIT = 'mirror.git',
  UPDATE_SEARCH_INDEX = 'search.index.update',
  INGEST_WIKIPEDIA = 'ingest.wikipedia',
  CREATE_PHENOMENON = 'create.phenomenon',
  GENERATE_AI_DRAFT = 'generate.ai.draft',
}

export type TaskPriority = 'low' | 'normal' | 'high';
