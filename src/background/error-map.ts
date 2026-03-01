import type { ExecutionResult } from "../types/api";

/**
 * Maps unknown runtime errors to a stable execution failure payload.
 */
export function mapExecutionError(error: unknown, durationMs: number): ExecutionResult {
  if (error instanceof DOMException && error.name === "AbortError") {
    return {
      ok: false,
      status: 0,
      headers: {},
      body: "",
      durationMs,
      error: "Request timed out"
    };
  }

  if (error instanceof Error) {
    return {
      ok: false,
      status: 0,
      headers: {},
      body: "",
      durationMs,
      error: error.message
    };
  }

  return {
    ok: false,
    status: 0,
    headers: {},
    body: "",
    durationMs,
    error: "Unknown error"
  };
}
