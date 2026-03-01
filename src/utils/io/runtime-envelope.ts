/**
 * Defines background response envelope shape.
 */
export interface RuntimeEnvelope {
  ok: boolean;
  result?: unknown;
  error?: string;
}

/**
 * Validates unknown runtime response envelope.
 */
export function parseRuntimeEnvelope(value: unknown): RuntimeEnvelope {
  if (typeof value !== "object" || value === null) {
    throw new Error("Runtime response is not an object");
  }

  const envelope = value as Partial<RuntimeEnvelope>;
  if (typeof envelope.ok !== "boolean") {
    throw new Error("Runtime response is missing 'ok' flag");
  }

  return {
    ok: envelope.ok,
    result: envelope.result,
    error: typeof envelope.error === "string" ? envelope.error : undefined
  };
}
