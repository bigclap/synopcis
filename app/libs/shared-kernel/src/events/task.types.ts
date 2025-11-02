export enum TaskType {
  RENDER_STATIC = 'render.static',
  ANALYZE_SOURCE = 'analyze.source',
  MIRROR_GIT = 'mirror.git',
  UPDATE_SEARCH_INDEX = 'search.index.update',
  INGEST_WIKIPEDIA = 'ingest.wikipedia',
  AI_DRAFT = 'ai.draft',
}

export type TaskPriority = 'low' | 'normal' | 'high';
