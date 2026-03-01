import { readShortcutFromForm, renderShortcutList } from "./shortcut-editor";
import type { RuntimeMessage, Shortcut } from "../types/api";

/**
 * Sends a typed runtime message and unwraps background response.
 */
async function sendMessage<T>(message: RuntimeMessage): Promise<T> {
  const response = await chrome.runtime.sendMessage(message);
  if (!response.ok) {
    throw new Error(response.error ?? "Unknown runtime error");
  }
  return response.result as T;
}

/**
 * Loads all shortcuts and renders them in options UI.
 */
async function refreshShortcutList(): Promise<void> {
  const shortcuts = await sendMessage<Shortcut[]>({ type: "shortcuts:list" });
  const container = document.getElementById("shortcuts") as HTMLElement;
  renderShortcutList(container, shortcuts);
}

/**
 * Deletes a shortcut and refreshes options list.
 */
async function deleteShortcut(shortcutId: string): Promise<void> {
  await sendMessage({ type: "shortcuts:delete", payload: { shortcutId } });
  await refreshShortcutList();
}

/**
 * Exports current state into options import/export textarea.
 */
async function exportStateToTextarea(): Promise<void> {
  const textarea = document.getElementById("state-json") as HTMLTextAreaElement;
  const result = await sendMessage<{ json: string }>({ type: "state:export" });
  textarea.value = result.json;
}

/**
 * Imports state from options import/export textarea.
 */
async function importStateFromTextarea(): Promise<void> {
  const textarea = document.getElementById("state-json") as HTMLTextAreaElement;
  await sendMessage({ type: "state:import", payload: { json: textarea.value } });
  await refreshShortcutList();
}

/**
 * Initializes options page interactions.
 */
async function initOptionsPage(): Promise<void> {
  const saveButton = document.getElementById("save-btn") as HTMLButtonElement;
  const exportButton = document.getElementById("export-btn") as HTMLButtonElement;
  const importButton = document.getElementById("import-btn") as HTMLButtonElement;
  const list = document.getElementById("shortcuts") as HTMLElement;

  saveButton.addEventListener("click", async () => {
    const shortcut = readShortcutFromForm();
    await sendMessage({ type: "shortcuts:save", payload: shortcut });
    await refreshShortcutList();
  });

  exportButton.addEventListener("click", async () => {
    await exportStateToTextarea();
  });

  importButton.addEventListener("click", async () => {
    await importStateFromTextarea();
  });

  list.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const action = target.getAttribute("data-action");
    const shortcutId = target.getAttribute("data-shortcut-id");
    if (action === "delete-shortcut" && shortcutId) {
      await deleteShortcut(shortcutId);
    }
  });

  await refreshShortcutList();
}

void initOptionsPage();
