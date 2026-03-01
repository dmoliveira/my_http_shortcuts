import { APP_CONSTANTS } from "./constants";
import type { PersistedState } from "../types/storage";

/**
 * Produces the default persisted state used on first run.
 */
export function getDefaultState(): PersistedState {
  return {
    shortcuts: [],
    history: [],
    schemaVersion: APP_CONSTANTS.schemaVersion
  };
}
