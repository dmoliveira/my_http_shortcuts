import { describe, expect, it } from "vitest";
import { buildHistoryResult } from "../src/background/history-payload";

describe("buildHistoryResult", () => {
  it("keeps short body as-is", () => {
    const result = buildHistoryResult({
      ok: true,
      status: 200,
      headers: {},
      body: "ok",
      durationMs: 10
    });

    expect(result.body).toBe("ok");
  });

  it("truncates oversized body for persistence", () => {
    const result = buildHistoryResult({
      ok: true,
      status: 200,
      headers: {},
      body: "x".repeat(20000),
      durationMs: 10
    });

    expect(result.body).toContain("[history truncated]");
  });
});
