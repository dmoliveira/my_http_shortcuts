import {
  readResultText,
  renderHistory,
  renderPopupStatus,
  renderResult,
  renderShortcutOptions,
  setButtonsBusy
} from "./popup-view";
import { sendRuntimeMessage } from "../utils/io/runtime-message";
import type { HistoryItem } from "../types/storage";

/**
 * Reads context from active tab and user selection.
 */
async function buildExecutionContext(): Promise<{ input: string; pageUrl: string }> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = tab?.id;

  if (!tabId) {
    return { input: "", pageUrl: tab?.url ?? "" };
  }

  const [{ result: input }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => window.getSelection?.()?.toString() ?? ""
  });

  return {
    input: typeof input === "string" ? input : "",
    pageUrl: tab?.url ?? ""
  };
}

/**
 * Loads recent history entries into popup list.
 */
async function refreshHistory(): Promise<void> {
  const historyElement = document.getElementById("history") as HTMLElement;
  const history = await sendRuntimeMessage<HistoryItem[]>({ type: "history:list" });
  renderHistory(historyElement, history);
}

/**
 * Initializes popup event handlers and data loading.
 */
async function initPopup(): Promise<void> {
  const selectElement = document.getElementById("shortcut-select") as HTMLSelectElement;
  const resultElement = document.getElementById("result") as HTMLElement;
  const statusElement = document.getElementById("popup-status") as HTMLElement;
  const runButton = document.getElementById("run-btn") as HTMLButtonElement;
  const copyResultButton = document.getElementById("copy-result-btn") as HTMLButtonElement;
  const clearHistoryButton = document.getElementById("clear-history-btn") as HTMLButtonElement;

  const shortcuts = await sendRuntimeMessage<Array<{ id: string; name: string }>>({ type: "shortcuts:list" });
  renderShortcutOptions(selectElement, shortcuts);
  await refreshHistory();

  runButton.addEventListener("click", async () => {
    setButtonsBusy([runButton, copyResultButton, clearHistoryButton], true);
    renderPopupStatus(statusElement, "Running shortcut...");
    try {
      if (!selectElement.value) {
        throw new Error("Please create and select a shortcut first");
      }
      const context = await buildExecutionContext();
      const result = await sendRuntimeMessage({
        type: "shortcut:run",
        payload: {
          shortcutId: selectElement.value,
          context
        }
      });
      renderResult(resultElement, result);
      await refreshHistory();
      renderPopupStatus(statusElement, "Run completed");
    } catch (error) {
      renderResult(resultElement, {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown popup error"
      });
      renderPopupStatus(statusElement, "Run failed");
    } finally {
      setButtonsBusy([runButton, copyResultButton, clearHistoryButton], false);
    }
  });

  clearHistoryButton.addEventListener("click", async () => {
    await sendRuntimeMessage({ type: "history:clear" });
    await refreshHistory();
  });

  copyResultButton.addEventListener("click", async () => {
    const text = readResultText(resultElement);
    if (!text.trim()) {
      renderPopupStatus(statusElement, "No result to copy");
      return;
    }
    await navigator.clipboard.writeText(text);
    renderPopupStatus(statusElement, "Result copied");
  });
}

void initPopup();
