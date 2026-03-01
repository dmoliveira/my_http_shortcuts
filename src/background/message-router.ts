import { createShortcut } from "../domain/shortcut";
import type { RuntimeMessage } from "../types/api";
import { loadState, saveState } from "../utils/io/storage";
import { assertShortcutValid } from "../utils/validation/schema";
import { executeShortcut } from "./executor";

/**
 * Routes runtime messages and returns async response payloads.
 */
export async function handleRuntimeMessage(message: RuntimeMessage): Promise<unknown> {
  if (message.type === "shortcuts:list") {
    const state = await loadState();
    return state.shortcuts;
  }

  if (message.type === "history:list") {
    const state = await loadState();
    return state.history;
  }

  if (message.type === "shortcuts:save") {
    const state = await loadState();
    const shortcut = createShortcut(message.payload);
    assertShortcutValid(shortcut);

    const existing = state.shortcuts.filter((entry) => entry.id !== shortcut.id);
    await saveState({ ...state, shortcuts: [shortcut, ...existing] });
    return shortcut;
  }

  if (message.type === "shortcut:run") {
    return executeShortcut(message.payload.shortcutId, message.payload.context);
  }

  return null;
}
