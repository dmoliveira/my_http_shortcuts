import type { HistoryItem } from "../types/storage";

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
    const status = item.result.ok ? "OK" : "ERR";
    li.textContent = `${status} ${item.shortcutName} (${item.result.status}) ${item.correlationId}`;
    listElement.append(li);
  }
}
