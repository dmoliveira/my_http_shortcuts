/**
 * Parses JSON safely and returns null on malformed payload.
 */
export function safeJsonParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

/**
 * Stringifies values safely and falls back to placeholder text.
 */
export function safeJsonStringify(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '"[unserializable]"';
  }
}
