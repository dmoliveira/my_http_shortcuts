import type { HistoryItem } from "../types/storage";
import type { ExecutionResult } from "../types/api";

const MAX_RESULT_LENGTH = 6000;

/**
 * Checks whether value has execution result shape.
 */
function isExecutionResult(value: unknown): value is ExecutionResult {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Partial<ExecutionResult>;
  return (
    typeof candidate.ok === "boolean" &&
    typeof candidate.status === "number" &&
    typeof candidate.body === "string" &&
    typeof candidate.durationMs === "number" &&
    typeof candidate.headers === "object" &&
    candidate.headers !== null
  );
}

/**
 * Formats execution result payload into readable sections.
 */
function formatExecutionResult(value: ExecutionResult): string {
  const lines = [
    `ok: ${value.ok}`,
    `status: ${value.status}`,
    `durationMs: ${value.durationMs}`,
    `error: ${value.error ?? ""}`,
    "",
    "headers:"
  ];

  for (const [name, headerValue] of Object.entries(value.headers)) {
    lines.push(`- ${name}: ${headerValue}`);
  }
  lines.push("", "body:", value.body);

  const text = lines.join("\n");
  if (text.length <= MAX_RESULT_LENGTH) {
    return text;
  }
  return `${text.slice(0, MAX_RESULT_LENGTH)}\n... [truncated]`;
}

/**
 * Converts any result payload into readable popup text.
 */
export function formatResultText(result: unknown): string {
  if (isExecutionResult(result)) {
    return formatExecutionResult(result);
  }

  const text = JSON.stringify(result, null, 2);
  if (text.length <= MAX_RESULT_LENGTH) {
    return text;
  }
  return `${text.slice(0, MAX_RESULT_LENGTH)}\n... [truncated]`;
}

/**
 * Formats one history entry for compact popup display.
 */
export function formatHistoryEntry(item: HistoryItem): string {
  const status = item.result.ok ? "OK" : "ERR";
  const time = new Date(item.createdAt).toLocaleTimeString();
  const source = item.source === "context_menu" ? "ctx" : item.source === "popup" ? "pop" : "unk";
  return `${status} [${source}] ${item.shortcutName} (${item.result.status}) ${item.result.durationMs}ms @ ${time}`;
}
