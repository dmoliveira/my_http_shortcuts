import { describe, expect, it } from "vitest";
import { mapExecutionError } from "../src/background/error-map";

describe("mapExecutionError", () => {
  it("maps abort errors to timeout message", () => {
    const result = mapExecutionError(new DOMException("aborted", "AbortError"), 100);
    expect(result.error).toBe("Request timed out");
  });

  it("maps regular errors to their messages", () => {
    const result = mapExecutionError(new Error("network fail"), 20);
    expect(result.error).toBe("network fail");
  });

  it("maps unknown values to fallback message", () => {
    const result = mapExecutionError("bad", 5);
    expect(result.error).toBe("Unknown error");
  });
});
