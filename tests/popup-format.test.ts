import { describe, expect, it } from "vitest";
import { formatHistoryEntry, formatResultText } from "../src/popup/popup-format";

describe("popup formatting", () => {
  it("formats history entries with status and timing", () => {
    const output = formatHistoryEntry({
      id: "h1",
      shortcutId: "s1",
      shortcutName: "Ping",
      createdAt: "2026-03-01T00:00:00.000Z",
      correlationId: "c1",
      result: { ok: true, status: 200, headers: {}, body: "ok", durationMs: 42 }
    });

    expect(output).toContain("OK Ping (200) 42ms");
  });

  it("truncates very large result output", () => {
    const output = formatResultText({ value: "x".repeat(8000) });
    expect(output).toContain("[truncated]");
  });

  it("formats execution result payload with details", () => {
    const output = formatResultText({
      ok: true,
      status: 200,
      headers: { "content-type": "application/json" },
      body: "{\"ok\":true}",
      durationMs: 55
    });

    expect(output).toContain("ok: true");
    expect(output).toContain("status: 200");
    expect(output).toContain("headers:");
    expect(output).toContain("body:");
  });
});
