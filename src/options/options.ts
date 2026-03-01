import { readShortcutFromForm, renderShortcutList } from "./shortcut-editor";
import type { Shortcut } from "../types/api";
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
    await runWithStatus(async () => {
      const shortcut = readShortcutFromForm();
      await sendRuntimeMessage({ type: "shortcuts:save", payload: shortcut });
      await refreshShortcutList();
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

  list.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const action = target.getAttribute("data-action");
    const shortcutId = target.getAttribute("data-shortcut-id");
    if (action === "delete-shortcut" && shortcutId) {
      await runWithStatus(async () => {
        await deleteShortcut(shortcutId);
      }, "Shortcut deleted");
    }
  });

  await refreshShortcutList();
}

void initOptionsPage();
