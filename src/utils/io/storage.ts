import { APP_CONSTANTS } from "../../config/constants";
import type { PersistedState } from "../../types/storage";
import { migrateState } from "./migrations";

/**
 * Reads persisted extension state or returns defaults.
 */
export async function loadState(): Promise<PersistedState> {
  const stored = await chrome.storage.local.get(APP_CONSTANTS.storageKey);
  return migrateState(stored[APP_CONSTANTS.storageKey]);
}

/**
 * Persists extension state atomically in local storage.
 */
export async function saveState(state: PersistedState): Promise<void> {
  await chrome.storage.local.set({ [APP_CONSTANTS.storageKey]: state });
}
