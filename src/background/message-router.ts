import { createShortcut } from "../domain/shortcut";
import { summarizeHistory } from "../domain/history-stats";
import { resolveDefaultContextShortcutId } from "../domain/settings";
import type { RuntimeMessage } from "../types/api";
import { exportStateJson, importStateJson } from "../utils/io/portability";
import { loadState, saveState } from "../utils/io/storage";
import { assertShortcutValid } from "../utils/validation/schema";
import { AppError } from "../utils/validation/errors";
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

  if (message.type === "history:stats") {
    const state = await loadState();
    return summarizeHistory(state.history);
  }

  if (message.type === "history:clear") {
    const state = await loadState();
    await saveState({ ...state, history: [] });
    return { cleared: true };
  }

  if (message.type === "settings:get") {
    const state = await loadState();
    return state.settings;
  }

  if (message.type === "shortcuts:save") {
    const state = await loadState();
    const shortcut = createShortcut(message.payload);
    assertShortcutValid(shortcut);

    const existing = state.shortcuts.filter((entry) => entry.id !== shortcut.id);
    await saveState({ ...state, shortcuts: [shortcut, ...existing] });
    return shortcut;
  }

  if (message.type === "shortcuts:delete") {
    const state = await loadState();
    const shortcuts = state.shortcuts.filter((entry) => entry.id !== message.payload.shortcutId);
    await saveState({
      ...state,
      shortcuts,
      settings: {
        ...state.settings,
        defaultContextShortcutId: resolveDefaultContextShortcutId(shortcuts, state.settings.defaultContextShortcutId)
      }
    });
    return { deleted: true };
  }

  if (message.type === "settings:update") {
    const state = await loadState();
    const defaultContextShortcutId = resolveDefaultContextShortcutId(
      state.shortcuts,
      message.payload.defaultContextShortcutId
    );

    await saveState({
      ...state,
      settings: {
        ...state.settings,
        defaultContextShortcutId
      }
    });
    return { saved: true };
  }

  if (message.type === "shortcut:run") {
    return executeShortcut(message.payload.shortcutId, message.payload.context, "popup");
  }

  if (message.type === "state:export") {
    const state = await loadState();
    return { json: exportStateJson(state) };
  }

  if (message.type === "state:import") {
    const state = importStateJson(message.payload.json);
    if (!state) {
      throw new AppError("STATE_IMPORT_INVALID_JSON", "State import payload is not valid JSON");
    }
    await saveState(state);
    return { imported: true, shortcuts: state.shortcuts.length };
  }

  return null;
}
