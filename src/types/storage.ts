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
 * Defines user-level extension settings.
 */
export interface AppSettings {
  defaultContextShortcutId: string | null;
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
