import { handleRuntimeMessage } from "./message-router";
import { executeShortcut } from "./executor";
import { selectContextShortcut } from "./context-shortcut";
import { loadState } from "../utils/io/storage";

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
    handleRuntimeMessage(message)
      .then((result) => sendResponse({ ok: true, result }))
      .catch((error) => sendResponse({ ok: false, error: error instanceof Error ? error.message : "Unknown error" }));
    return true;
  });

  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId !== "run-shortcut") {
      return;
    }

    const state = await loadState();
    const targetShortcut = selectContextShortcut(state.shortcuts, state.settings.defaultContextShortcutId);

    if (!targetShortcut) {
      return;
    }

    await executeShortcut(targetShortcut.id, {
      input: info.selectionText ?? "",
      pageUrl: tab?.url ?? ""
    });
  });
}

registerListeners();
