import { describe, expect, it } from "vitest";
import { formatOptionsHistoryEntry } from "../src/options/history-view";

describe("formatOptionsHistoryEntry", () => {
  it("formats compact line with status and correlation id", () => {
    const output = formatOptionsHistoryEntry({
      id: "h1",
      shortcutId: "s1",
      shortcutName: "Ping",
      createdAt: "2026-03-01T00:00:00.000Z",
      correlationId: "cid-1",
      result: { ok: true, status: 200, headers: {}, body: "ok", durationMs: 9 }
    });

    expect(output).toBe("OK Ping (200) cid-1");
  });
});
