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
 * Initializes options page interactions.
 */
async function initOptionsPage(): Promise<void> {
  const saveButton = document.getElementById("save-btn") as HTMLButtonElement;
  saveButton.addEventListener("click", async () => {
    const shortcut = readShortcutFromForm();
    await sendMessage({ type: "shortcuts:save", payload: shortcut });
    await refreshShortcutList();
  });

  await refreshShortcutList();
}

void initOptionsPage();
