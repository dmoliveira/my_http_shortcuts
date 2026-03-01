import type { ExecutionResult, ExecutionSource, Shortcut } from "./api";

/**
 * Describes a persisted history item for past executions.
 */
export interface HistoryItem {
  id: string;
  shortcutId: string;
  shortcutName: string;
  source: ExecutionSource;
  createdAt: string;
  correlationId: string;
  result: ExecutionResult;
}

/**
 * Defines user-level extension settings.
 */
export interface AppSettings {
  defaultContextShortcutId: string | null;
}

/**
 * Describes aggregate metrics for execution history.
 */
export interface HistoryStats {
  total: number;
  ok: number;
  error: number;
  successRatePct: number;
  avgDurationMs: number;
  maxDurationMs: number;
  bySource: Record<string, number>;
}

/**
 * Defines extension storage contract.
 */
export interface PersistedState {
  shortcuts: Shortcut[];
  history: HistoryItem[];
  settings: AppSettings;
  schemaVersion: number;
}
