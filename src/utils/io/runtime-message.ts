import type { RuntimeMessage } from "../../types/api";

/**
 * Sends a typed runtime message and unwraps the background response envelope.
 */
export async function sendRuntimeMessage<T>(message: RuntimeMessage): Promise<T> {
  const response = await chrome.runtime.sendMessage(message);
  if (!response.ok) {
    throw new Error(response.error ?? "Unknown runtime error");
  }
  return response.result as T;
}
