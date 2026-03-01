import { describe, expect, it, vi } from "vitest";
import { isRetryableError, runWithRetry } from "../src/background/retry";

describe("retry", () => {
  it("detects retryable errors", () => {
    expect(isRetryableError(new DOMException("aborted", "AbortError"))).toBe(true);
    expect(isRetryableError(new TypeError("network"))).toBe(true);
    expect(isRetryableError(new Error("regular"))).toBe(false);
  });

  it("retries until operation succeeds", async () => {
    const operation = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new TypeError("fail"))
      .mockResolvedValueOnce("ok");

    const result = await runWithRetry(operation, 1, 0);
    expect(result).toBe("ok");
    expect(operation).toHaveBeenCalledTimes(2);
  });
});
