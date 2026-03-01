import { describe, expect, it } from "vitest";
import { formatOptionsHistoryEntry, renderOptionsHistoryStats } from "../src/options/history-view";

describe("formatOptionsHistoryEntry", () => {
  it("formats compact line with status and correlation id", () => {
    const output = formatOptionsHistoryEntry({
      id: "h1",
      shortcutId: "s1",
      shortcutName: "Ping",
      source: "context_menu",
      createdAt: "2026-03-01T00:00:00.000Z",
      correlationId: "cid-1",
      result: { ok: true, status: 200, headers: {}, body: "ok", durationMs: 9 }
    });

    expect(output).toBe("OK [context_menu] Ping (200) cid-1");
  });

  it("renders options history stats line", () => {
    const element = document.createElement("p");
    renderOptionsHistoryStats(element, {
      total: 3,
      ok: 2,
      error: 1,
      bySource: { popup: 2, context_menu: 1 }
    });

    expect(element.textContent).toBe("Total: 3 | OK: 2 | ERR: 1 | pop: 2 | ctx: 1");
  });
});
