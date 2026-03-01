import type { HistoryItem } from "../types/storage";

const MAX_RESULT_LENGTH = 6000;

/**
 * Converts any result payload into readable popup text.
 */
export function formatResultText(result: unknown): string {
  const text = JSON.stringify(result, null, 2);
  if (text.length <= MAX_RESULT_LENGTH) {
    return text;
  }
  return `${text.slice(0, MAX_RESULT_LENGTH)}\n... [truncated]`;
}

/**
 * Formats one history entry for compact popup display.
 */
export function formatHistoryEntry(item: HistoryItem): string {
  const status = item.result.ok ? "OK" : "ERR";
  const time = new Date(item.createdAt).toLocaleTimeString();
  return `${status} ${item.shortcutName} (${item.result.status}) ${item.result.durationMs}ms @ ${time}`;
}
