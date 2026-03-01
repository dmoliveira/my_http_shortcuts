/**
 * Waits for a delay between retry attempts.
 */
async function sleep(delayMs: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

/**
 * Returns true when an error is retryable.
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === "AbortError") {
    return true;
  }
  if (error instanceof TypeError) {
    return true;
  }
  return false;
}

/**
 * Runs async operation with retry semantics for retryable errors.
 */
export async function runWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number,
  retryDelayMs: number
): Promise<T> {
  let attempt = 0;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= maxRetries || !isRetryableError(error)) {
        throw error;
      }
      attempt += 1;
      await sleep(retryDelayMs);
    }
  }
}
