import type { Shortcut } from "../../types/api";

/**
 * Creates fetch init payload from a resolved shortcut config.
 */
export function buildRequestInit(shortcut: Shortcut, resolvedBody: string): RequestInit {
  const headers = new Headers(shortcut.headers);
  const hasBody = shortcut.method !== "GET" && shortcut.method !== "DELETE";

  return {
    method: shortcut.method,
    headers,
    body: hasBody ? resolvedBody : undefined
  };
}
