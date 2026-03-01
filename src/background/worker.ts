import { handleRuntimeMessage } from "./message-router";
import { buildContextMenuExecutionContext } from "./context-menu";
import { executeShortcut } from "./executor";
import { selectContextShortcut } from "./context-shortcut";
import { loadState } from "../utils/io/storage";
import { createCorrelationId, logError, logInfo } from "../utils/log/logger";
import { isRuntimeMessage } from "../utils/validation/runtime-message";

/**
 * Registers background listeners for extension runtime events.
 */
function registerListeners(): void {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "run-shortcut",
      title: "Run HTTP Shortcut",
      contexts: ["selection", "page"]
    });
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!isRuntimeMessage(message)) {
      sendResponse({ ok: false, error: "Invalid runtime message payload" });
      return false;
    }

    handleRuntimeMessage(message)
      .then((result) => sendResponse({ ok: true, result }))
      .catch((error) => sendResponse({ ok: false, error: error instanceof Error ? error.message : "Unknown error" }));
    return true;
  });

  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId !== "run-shortcut") {
      return;
    }

    const correlationId = createCorrelationId();

    const state = await loadState();
    const targetShortcut = selectContextShortcut(state.shortcuts, state.settings.defaultContextShortcutId);

    if (!targetShortcut) {
      logInfo(correlationId, "Context menu run skipped: no shortcuts configured");
      return;
    }

    try {
      await executeShortcut(targetShortcut.id, buildContextMenuExecutionContext(info.selectionText, tab?.url), "context_menu");
      logInfo(correlationId, "Context menu run completed", { shortcutId: targetShortcut.id });
    } catch (error) {
      logError(correlationId, "Context menu run failed", error);
    }
  });
}

registerListeners();
