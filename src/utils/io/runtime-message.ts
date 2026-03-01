import type { RuntimeMessage } from "../../types/api";
import { parseRuntimeEnvelope } from "./runtime-envelope";

/**
 * Sends a typed runtime message and unwraps the background response envelope.
 */
export async function sendRuntimeMessage<T>(message: RuntimeMessage): Promise<T> {
  const raw = await chrome.runtime.sendMessage(message);
  const response = parseRuntimeEnvelope(raw);

  if (!response.ok) {
    throw new Error(response.error ?? "Unknown runtime error");
  }

  return response.result as T;
}
