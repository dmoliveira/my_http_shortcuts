import type { PersistedState } from "../../types/storage";
import { safeJsonParse, safeJsonStringify } from "./serialization";
import { migrateState } from "./migrations";

/**
 * Exports persisted state to formatted JSON text.
 */
export function exportStateJson(state: PersistedState): string {
  return safeJsonStringify(state);
}

/**
 * Imports persisted state from JSON text with migration.
 */
export function importStateJson(payload: string): PersistedState | null {
  const parsed = safeJsonParse<unknown>(payload);
  if (parsed === null) {
    return null;
  }
  return migrateState(parsed);
}
