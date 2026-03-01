import { renderResult, renderShortcutOptions } from "./popup-view";
import { sendRuntimeMessage } from "../utils/io/runtime-message";

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
 * Initializes popup event handlers and data loading.
 */
async function initPopup(): Promise<void> {
  const selectElement = document.getElementById("shortcut-select") as HTMLSelectElement;
  const resultElement = document.getElementById("result") as HTMLElement;
  const runButton = document.getElementById("run-btn") as HTMLButtonElement;

  const shortcuts = await sendRuntimeMessage<Array<{ id: string; name: string }>>({ type: "shortcuts:list" });
  renderShortcutOptions(selectElement, shortcuts);

  runButton.addEventListener("click", async () => {
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
    } catch (error) {
      renderResult(resultElement, {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown popup error"
      });
    }
  });
}

void initPopup();
