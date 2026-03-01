import { APP_CONSTANTS } from "../../config/constants";
import { getDefaultState } from "../../config/defaults";
import type { PersistedState } from "../../types/storage";

/**
 * Reads persisted extension state or returns defaults.
 */
export async function loadState(): Promise<PersistedState> {
  const stored = await chrome.storage.local.get(APP_CONSTANTS.storageKey);
  const value = stored[APP_CONSTANTS.storageKey] as PersistedState | undefined;
  return value ?? getDefaultState();
}

/**
 * Persists extension state atomically in local storage.
 */
export async function saveState(state: PersistedState): Promise<void> {
  await chrome.storage.local.set({ [APP_CONSTANTS.storageKey]: state });
}
