import type { HistoryItem } from "../types/storage";
import { formatHistoryEntry, formatResultText } from "./popup-format";

/**
 * Renders shortcut options into the popup select element.
 */
export function renderShortcutOptions(
  selectElement: HTMLSelectElement,
  shortcuts: Array<{ id: string; name: string }>
): void {
  selectElement.innerHTML = "";
  for (const shortcut of shortcuts) {
    const option = document.createElement("option");
    option.value = shortcut.id;
    option.textContent = shortcut.name;
    selectElement.append(option);
  }
}

/**
 * Renders execution results in a readable text block.
 */
export function renderResult(preElement: HTMLElement, result: unknown): void {
  preElement.textContent = formatResultText(result);
}

/**
 * Renders compact history entries in popup.
 */
export function renderHistory(listElement: HTMLElement, history: HistoryItem[]): void {
  listElement.innerHTML = "";

  if (history.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No history yet.";
    listElement.append(empty);
    return;
  }

  for (const item of history.slice(0, 10)) {
    const li = document.createElement("li");
    li.textContent = formatHistoryEntry(item);
    listElement.append(li);
  }
}
