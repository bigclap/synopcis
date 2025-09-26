export interface ViewerContextInput {
  readonly id?: string | null;
  readonly roles?: readonly string[];
  readonly attributes?: Record<string, unknown>;
}

export interface ViewerContext {
  readonly id?: string;
  readonly roles: readonly string[];
  readonly attributes: Record<string, unknown>;
  readonly isAuthenticated: boolean;
}
