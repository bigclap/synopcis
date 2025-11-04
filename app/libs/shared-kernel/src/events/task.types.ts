export enum TaskType {
  RENDER_STATIC = 'render.static',
  ANALYZE_SOURCE = 'analyze.source',
  MIRROR_GIT = 'mirror.git',
  UPDATE_SEARCH_INDEX = 'search.index.update',
  INGEST_WIKIPEDIA = 'ingest.wikipedia',
  CREATE_PHENOMENON = 'create.phenomenon',
  GENERATE_AI_DRAFT = 'generate.ai.draft',
  AI_DRAFT = 'ai.draft',
  GET_AI_SUGGESTIONS = 'get.ai.suggestions',
}

export type TaskPriority = 'low' | 'normal' | 'high';
