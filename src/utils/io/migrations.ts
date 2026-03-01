import { APP_CONSTANTS } from "../../config/constants";
import { getDefaultState } from "../../config/defaults";
import type { PersistedState } from "../../types/storage";

/**
 * Checks whether an unknown value is a plain object.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Migrates persisted payloads into the current storage schema.
 */
export function migrateState(value: unknown): PersistedState {
  if (!isRecord(value)) {
    return getDefaultState();
  }

  const shortcuts = Array.isArray(value.shortcuts) ? value.shortcuts : [];
  const history = Array.isArray(value.history) ? value.history : [];

  return {
    shortcuts,
    history,
    schemaVersion: APP_CONSTANTS.schemaVersion
  } as PersistedState;
}
