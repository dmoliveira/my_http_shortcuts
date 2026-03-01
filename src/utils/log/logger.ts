import { redactSecrets } from "./redact";
import { safeJsonStringify } from "../io/serialization";

/**
 * Creates a correlation id to group related logs.
 */
export function createCorrelationId(): string {
  return `${Date.now()}-${crypto.randomUUID()}`;
}

/**
 * Logs a structured informational event.
 */
export function logInfo(correlationId: string, message: string, details?: unknown): void {
  console.info(JSON.stringify({ level: "info", correlationId, message, details }));
}

/**
 * Logs a structured error event with sanitized details.
 */
export function logError(correlationId: string, message: string, error: unknown): void {
  const raw = typeof error === "string" ? error : safeJsonStringify(error);
  console.error(JSON.stringify({ level: "error", correlationId, message, error: redactSecrets(raw) }));
}
