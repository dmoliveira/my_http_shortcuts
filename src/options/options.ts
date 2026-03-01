import { readShortcutFromForm, renderShortcutList } from "./shortcut-editor";
import {
  filterHistoryByMinDuration,
  filterHistoryByQuery,
  filterHistoryByResult,
  filterHistoryBySource,
  limitHistoryEntries,
  renderOptionsHistory,
  renderOptionsHistoryStats,
  sortHistory
} from "./history-view";
import { readHistoryFilters, resetHistoryFilters } from "./history-filters";
import { readDefaultContextSelection, renderDefaultContextOptions } from "./default-context";
import type { Shortcut } from "../types/api";
import type { HistoryItem, HistoryStats } from "../types/storage";
import { requireElement } from "../utils/dom/required-element";
import { sendRuntimeMessage } from "../utils/io/runtime-message";

/**
 * Loads all shortcuts and renders them in options UI.
 */
async function refreshShortcutList(): Promise<void> {
  const shortcuts = await sendRuntimeMessage<Shortcut[]>({ type: "shortcuts:list" });
  const container = requireElement<HTMLElement>("shortcuts");
  renderShortcutList(container, shortcuts);
}

/**
 * Loads shortcuts and settings, then renders default context selector.
 */
async function refreshDefaultContextSelector(): Promise<void> {
  const select = requireElement<HTMLSelectElement>("default-context-shortcut");
  const shortcuts = await sendRuntimeMessage<Shortcut[]>({ type: "shortcuts:list" });
  const settings = await sendRuntimeMessage<{ defaultContextShortcutId: string | null }>({ type: "settings:get" });
  renderDefaultContextOptions(select, shortcuts, settings.defaultContextShortcutId);
}

/**
 * Loads and renders debug history in options panel.
 */
async function refreshHistoryList(): Promise<void> {
  const history = await sendRuntimeMessage<HistoryItem[]>({ type: "history:list" });
  const container = requireElement<HTMLElement>("options-history");
  const statsElement = requireElement<HTMLElement>("options-history-stats");
  const filters = readHistoryFilters({
    source: requireElement<HTMLSelectElement>("history-source-filter"),
    result: requireElement<HTMLSelectElement>("history-result-filter"),
    query: requireElement<HTMLInputElement>("history-query-filter"),
    sort: requireElement<HTMLSelectElement>("history-sort-mode"),
    maxItems: requireElement<HTMLSelectElement>("history-max-items"),
    minDurationMs: requireElement<HTMLInputElement>("history-min-duration")
  });
  const stats = await sendRuntimeMessage<HistoryStats>({ type: "history:stats" });
  const sourceFiltered = filterHistoryBySource(history, filters.source);
  const resultFiltered = filterHistoryByResult(sourceFiltered, filters.result);
  const queryFiltered = filterHistoryByQuery(resultFiltered, filters.query);
  const durationFiltered = filterHistoryByMinDuration(queryFiltered, filters.minDurationMs);
  const sorted = sortHistory(durationFiltered, filters.sort);
  const finalHistory = limitHistoryEntries(sorted, filters.maxItems);
  renderOptionsHistory(container, finalHistory);
  renderOptionsHistoryStats(statsElement, stats);
}

/**
 * Renders user-facing status messages in the options page.
 */
function setStatus(message: string): void {
  const statusElement = requireElement<HTMLElement>("status");
  statusElement.textContent = message;
}

/**
 * Runs one async UI action and reports errors in status area.
 */
async function runWithStatus(action: () => Promise<void>, successMessage: string): Promise<void> {
  try {
    await action();
    setStatus(successMessage);
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Unexpected options error");
  }
}

/**
 * Deletes a shortcut and refreshes options list.
 */
async function deleteShortcut(shortcutId: string): Promise<void> {
  await sendRuntimeMessage({ type: "shortcuts:delete", payload: { shortcutId } });
  await refreshShortcutList();
}

/**
 * Exports current state into options import/export textarea.
 */
async function exportStateToTextarea(): Promise<void> {
  const textarea = requireElement<HTMLTextAreaElement>("state-json");
  const result = await sendRuntimeMessage<{ json: string }>({ type: "state:export" });
  textarea.value = result.json;
}

/**
 * Imports state from options import/export textarea.
 */
async function importStateFromTextarea(): Promise<void> {
  const textarea = requireElement<HTMLTextAreaElement>("state-json");
  await sendRuntimeMessage({ type: "state:import", payload: { json: textarea.value } });
  await refreshShortcutList();
  await refreshHistoryList();
}

/**
 * Clears execution history and refreshes debug panel.
 */
async function clearHistory(): Promise<void> {
  await sendRuntimeMessage({ type: "history:clear" });
  await refreshHistoryList();
}

/**
 * Saves selected default shortcut for context menu execution.
 */
async function saveDefaultContextShortcut(): Promise<void> {
  const select = requireElement<HTMLSelectElement>("default-context-shortcut");
  const defaultContextShortcutId = readDefaultContextSelection(select);
  await sendRuntimeMessage({ type: "settings:update", payload: { defaultContextShortcutId } });
}

/**
 * Initializes options page interactions.
 */
async function initOptionsPage(): Promise<void> {
  const saveButton = requireElement<HTMLButtonElement>("save-btn");
  const exportButton = requireElement<HTMLButtonElement>("export-btn");
  const importButton = requireElement<HTMLButtonElement>("import-btn");
  const clearHistoryButton = requireElement<HTMLButtonElement>("clear-history-options-btn");
  const saveDefaultContextButton = requireElement<HTMLButtonElement>("save-default-context-btn");
  const historySourceFilter = requireElement<HTMLSelectElement>("history-source-filter");
  const historyResultFilter = requireElement<HTMLSelectElement>("history-result-filter");
  const historyQueryFilter = requireElement<HTMLInputElement>("history-query-filter");
  const historySortMode = requireElement<HTMLSelectElement>("history-sort-mode");
  const historyMaxItems = requireElement<HTMLSelectElement>("history-max-items");
  const historyMinDuration = requireElement<HTMLInputElement>("history-min-duration");
  const historyResetFiltersButton = requireElement<HTMLButtonElement>("history-reset-filters-btn");
  const list = requireElement<HTMLElement>("shortcuts");

  saveButton.addEventListener("click", async () => {
    await runWithStatus(async () => {
      const shortcut = readShortcutFromForm();
      await sendRuntimeMessage({ type: "shortcuts:save", payload: shortcut });
      await refreshShortcutList();
      await refreshDefaultContextSelector();
    }, "Shortcut saved");
  });

  exportButton.addEventListener("click", async () => {
    await runWithStatus(async () => {
      await exportStateToTextarea();
    }, "State exported");
  });

  importButton.addEventListener("click", async () => {
    await runWithStatus(async () => {
      await importStateFromTextarea();
    }, "State imported");
  });

  clearHistoryButton.addEventListener("click", async () => {
    await runWithStatus(async () => {
      await clearHistory();
    }, "History cleared");
  });

  saveDefaultContextButton.addEventListener("click", async () => {
    await runWithStatus(async () => {
      await saveDefaultContextShortcut();
    }, "Default context shortcut saved");
  });

  historySourceFilter.addEventListener("change", async () => {
    await refreshHistoryList();
  });

  historyResultFilter.addEventListener("change", async () => {
    await refreshHistoryList();
  });

  historyQueryFilter.addEventListener("input", async () => {
    await refreshHistoryList();
  });

  historySortMode.addEventListener("change", async () => {
    await refreshHistoryList();
  });

  historyMaxItems.addEventListener("change", async () => {
    await refreshHistoryList();
  });

  historyMinDuration.addEventListener("input", async () => {
    await refreshHistoryList();
  });

  historyResetFiltersButton.addEventListener("click", async () => {
    resetHistoryFilters({
      source: historySourceFilter,
      result: historyResultFilter,
      query: historyQueryFilter,
      sort: historySortMode,
      maxItems: historyMaxItems,
      minDurationMs: historyMinDuration
    });
    await refreshHistoryList();
    setStatus("History filters reset");
  });

  list.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const action = target.getAttribute("data-action");
    const shortcutId = target.getAttribute("data-shortcut-id");
    if (action === "delete-shortcut" && shortcutId) {
      await runWithStatus(async () => {
        await deleteShortcut(shortcutId);
        await refreshDefaultContextSelector();
      }, "Shortcut deleted");
    }
  });

  await refreshShortcutList();
  await refreshDefaultContextSelector();
  await refreshHistoryList();
}

void initOptionsPage();
