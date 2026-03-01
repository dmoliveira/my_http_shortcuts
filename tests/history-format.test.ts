import { describe, expect, it } from "vitest";
import {
  filterHistoryByResult,
  filterHistoryBySource,
  formatOptionsHistoryEntry,
  renderOptionsHistoryStats
} from "../src/options/history-view";

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

  it("filters history by selected source", () => {
    const filtered = filterHistoryBySource(
      [
        {
          id: "1",
          shortcutId: "s1",
          shortcutName: "A",
          source: "popup",
          createdAt: "2026-03-01T00:00:00.000Z",
          correlationId: "c1",
          result: { ok: true, status: 200, headers: {}, body: "ok", durationMs: 10 }
        },
        {
          id: "2",
          shortcutId: "s2",
          shortcutName: "B",
          source: "context_menu",
          createdAt: "2026-03-01T00:00:00.000Z",
          correlationId: "c2",
          result: { ok: true, status: 200, headers: {}, body: "ok", durationMs: 10 }
        }
      ],
      "popup"
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.source).toBe("popup");
  });

  it("filters history by result status", () => {
    const filtered = filterHistoryByResult(
      [
        {
          id: "1",
          shortcutId: "s1",
          shortcutName: "A",
          source: "popup",
          createdAt: "2026-03-01T00:00:00.000Z",
          correlationId: "c1",
          result: { ok: true, status: 200, headers: {}, body: "ok", durationMs: 10 }
        },
        {
          id: "2",
          shortcutId: "s2",
          shortcutName: "B",
          source: "context_menu",
          createdAt: "2026-03-01T00:00:00.000Z",
          correlationId: "c2",
          result: { ok: false, status: 500, headers: {}, body: "err", durationMs: 10 }
        }
      ],
      "error"
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.result.ok).toBe(false);
  });
});
