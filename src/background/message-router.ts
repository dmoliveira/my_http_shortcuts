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
  switch (message.type) {
    case "shortcuts:list": {
      const state = await loadState();
      return state.shortcuts;
    }
    case "history:list": {
      const state = await loadState();
      return state.history;
    }
    case "history:stats": {
      const state = await loadState();
      return summarizeHistory(state.history);
    }
    case "history:clear": {
      const state = await loadState();
      await saveState({ ...state, history: [] });
      return { cleared: true };
    }
    case "settings:get": {
      const state = await loadState();
      return state.settings;
    }
    case "shortcuts:save": {
      const state = await loadState();
      const shortcut = createShortcut(message.payload);
      assertShortcutValid(shortcut);

      const existing = state.shortcuts.filter((entry) => entry.id !== shortcut.id);
      await saveState({ ...state, shortcuts: [shortcut, ...existing] });
      return shortcut;
    }
    case "shortcuts:delete": {
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
    case "settings:update": {
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
    case "shortcut:run":
      return executeShortcut(message.payload.shortcutId, message.payload.context, "popup");
    case "state:export": {
      const state = await loadState();
      return { json: exportStateJson(state) };
    }
    case "state:import": {
      const state = importStateJson(message.payload.json);
      if (!state) {
        throw new AppError("STATE_IMPORT_INVALID_JSON", "State import payload is not valid JSON");
      }
      await saveState(state);
      return { imported: true, shortcuts: state.shortcuts.length };
    }
    default:
      return null;
  }
}
