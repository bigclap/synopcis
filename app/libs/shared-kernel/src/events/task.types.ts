export enum TaskType {
  RENDER_STATIC = 'render.static',
  ANALYZE_SOURCE = 'analyze.source',
  MIRROR_GIT = 'mirror.git',
  UPDATE_SEARCH_INDEX = 'search.index.update',
}

export type TaskPriority = 'low' | 'normal' | 'high';
