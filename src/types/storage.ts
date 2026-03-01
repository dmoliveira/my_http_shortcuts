import type { ExecutionResult, Shortcut } from "./api";

/**
 * Describes a persisted history item for past executions.
 */
export interface HistoryItem {
  id: string;
  shortcutId: string;
  shortcutName: string;
  createdAt: string;
  correlationId: string;
  result: ExecutionResult;
}

/**
 * Defines extension storage contract.
 */
export interface PersistedState {
  shortcuts: Shortcut[];
  history: HistoryItem[];
  schemaVersion: number;
}
