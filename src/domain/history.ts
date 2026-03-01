import { APP_CONSTANTS } from "../config/constants";
import type { HistoryItem } from "../types/storage";

/**
 * Inserts a history item and enforces configured history limit.
 */
export function pushHistory(items: HistoryItem[], item: HistoryItem): HistoryItem[] {
  return [item, ...items].slice(0, APP_CONSTANTS.historyLimit);
}
