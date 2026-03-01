/**
 * Redacts common secret patterns from free-form text.
 */
export function redactSecrets(value: string): string {
  return value
    .replace(/(authorization\s*:\s*bearer\s+)[^\s]+/gi, "$1***")
    .replace(/("api[_-]?key"\s*:\s*")[^"]+/gi, "$1***")
    .replace(/("token"\s*:\s*")[^"]+/gi, "$1***");
}

/**
 * Redacts secret-like headers before logging.
 */
export function redactHeaders(headers: Record<string, string>): Record<string, string> {
  const output: Record<string, string> = {};
  for (const [name, value] of Object.entries(headers)) {
    const lowered = name.toLowerCase();
    output[name] = lowered.includes("authorization") || lowered.includes("token") ? "***" : value;
  }
  return output;
}
