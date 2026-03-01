import { renderResult, renderShortcutOptions } from "./popup-view";
import type { RuntimeMessage } from "../types/api";

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
 * Reads context from active tab and user selection.
 */
async function buildExecutionContext(): Promise<{ input: string; pageUrl: string }> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return {
    input: "",
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

  const shortcuts = await sendMessage<Array<{ id: string; name: string }>>({ type: "shortcuts:list" });
  renderShortcutOptions(selectElement, shortcuts);

  runButton.addEventListener("click", async () => {
    const context = await buildExecutionContext();
    const result = await sendMessage({
      type: "shortcut:run",
      payload: {
        shortcutId: selectElement.value,
        context
      }
    });
    renderResult(resultElement, result);
  });
}

void initPopup();
