import type { HistoryItem, HistoryStats } from "../types/storage";

/**
 * Formats one options history entry text line.
 */
export function formatOptionsHistoryEntry(item: HistoryItem): string {
  const status = item.result.ok ? "OK" : "ERR";
  return `${status} [${item.source}] ${item.shortcutName} (${item.result.status}) ${item.correlationId}`;
}

/**
 * Renders recent history items in options debug panel.
 */
export function renderOptionsHistory(listElement: HTMLElement, history: HistoryItem[]): void {
  listElement.innerHTML = "";

  if (history.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No history yet.";
    listElement.append(empty);
    return;
  }

  for (const item of history.slice(0, 20)) {
    const li = document.createElement("li");
    li.textContent = formatOptionsHistoryEntry(item);
    listElement.append(li);
  }
}

/**
 * Renders aggregate history stats in options debug section.
 */
export function renderOptionsHistoryStats(statsElement: HTMLElement, stats: HistoryStats): void {
  const popupCount = stats.bySource.popup ?? 0;
  const contextCount = stats.bySource.context_menu ?? 0;
  statsElement.textContent = `Total: ${stats.total} | OK: ${stats.ok} | ERR: ${stats.error} | pop: ${popupCount} | ctx: ${contextCount}`;
}
