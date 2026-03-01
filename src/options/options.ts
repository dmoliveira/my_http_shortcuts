import { readShortcutFromForm, renderShortcutList } from "./shortcut-editor";
import { renderOptionsHistory } from "./history-view";
import type { Shortcut } from "../types/api";
import type { HistoryItem } from "../types/storage";
import { sendRuntimeMessage } from "../utils/io/runtime-message";

/**
 * Loads all shortcuts and renders them in options UI.
 */
async function refreshShortcutList(): Promise<void> {
  const shortcuts = await sendRuntimeMessage<Shortcut[]>({ type: "shortcuts:list" });
  const container = document.getElementById("shortcuts") as HTMLElement;
  renderShortcutList(container, shortcuts);
}

/**
 * Loads shortcuts and settings, then renders default context selector.
 */
async function refreshDefaultContextSelector(): Promise<void> {
  const select = document.getElementById("default-context-shortcut") as HTMLSelectElement;
  const shortcuts = await sendRuntimeMessage<Shortcut[]>({ type: "shortcuts:list" });
  const settings = await sendRuntimeMessage<{ defaultContextShortcutId: string | null }>({ type: "settings:get" });

  select.innerHTML = "";

  const none = document.createElement("option");
  none.value = "";
  none.textContent = "(None)";
  select.append(none);

  for (const shortcut of shortcuts) {
    const option = document.createElement("option");
    option.value = shortcut.id;
    option.textContent = shortcut.name;
    select.append(option);
  }

  select.value = settings.defaultContextShortcutId ?? "";
}

/**
 * Loads and renders debug history in options panel.
 */
async function refreshHistoryList(): Promise<void> {
  const history = await sendRuntimeMessage<HistoryItem[]>({ type: "history:list" });
  const container = document.getElementById("options-history") as HTMLElement;
  renderOptionsHistory(container, history);
}

/**
 * Renders user-facing status messages in the options page.
 */
function setStatus(message: string): void {
  const statusElement = document.getElementById("status") as HTMLElement;
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
  const textarea = document.getElementById("state-json") as HTMLTextAreaElement;
  const result = await sendRuntimeMessage<{ json: string }>({ type: "state:export" });
  textarea.value = result.json;
}

/**
 * Imports state from options import/export textarea.
 */
async function importStateFromTextarea(): Promise<void> {
  const textarea = document.getElementById("state-json") as HTMLTextAreaElement;
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
  const select = document.getElementById("default-context-shortcut") as HTMLSelectElement;
  const defaultContextShortcutId = select.value || null;
  await sendRuntimeMessage({ type: "settings:update", payload: { defaultContextShortcutId } });
}

/**
 * Initializes options page interactions.
 */
async function initOptionsPage(): Promise<void> {
  const saveButton = document.getElementById("save-btn") as HTMLButtonElement;
  const exportButton = document.getElementById("export-btn") as HTMLButtonElement;
  const importButton = document.getElementById("import-btn") as HTMLButtonElement;
  const clearHistoryButton = document.getElementById("clear-history-options-btn") as HTMLButtonElement;
  const saveDefaultContextButton = document.getElementById("save-default-context-btn") as HTMLButtonElement;
  const list = document.getElementById("shortcuts") as HTMLElement;

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
