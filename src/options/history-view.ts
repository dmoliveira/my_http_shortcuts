import type { HistoryItem, HistoryStats } from "../types/storage";

/**
 * Filters history entries by source selector value.
 */
export function filterHistoryBySource(history: HistoryItem[], source: string): HistoryItem[] {
  if (source === "all") {
    return history;
  }
  return history.filter((item) => item.source === source);
}

/**
 * Filters history entries by result status selector value.
 */
export function filterHistoryByResult(history: HistoryItem[], resultFilter: string): HistoryItem[] {
  if (resultFilter === "all") {
    return history;
  }
  if (resultFilter === "ok") {
    return history.filter((item) => item.result.ok);
  }
  if (resultFilter === "error") {
    return history.filter((item) => !item.result.ok);
  }
  return history;
}

/**
 * Filters history entries by shortcut name query.
 */
export function filterHistoryByQuery(history: HistoryItem[], query: string): HistoryItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return history;
  }
  return history.filter((item) => item.shortcutName.toLowerCase().includes(normalized));
}

/**
 * Sorts history entries according to selected mode.
 */
export function sortHistory(history: HistoryItem[], mode: string): HistoryItem[] {
  const copy = [...history];
  if (mode === "oldest") {
    return copy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
  if (mode === "slowest") {
    return copy.sort((a, b) => b.result.durationMs - a.result.durationMs);
  }
  if (mode === "fastest") {
    return copy.sort((a, b) => a.result.durationMs - b.result.durationMs);
  }
  return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

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
