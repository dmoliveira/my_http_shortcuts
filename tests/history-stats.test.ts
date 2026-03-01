import { describe, expect, it } from "vitest";
import { summarizeHistory } from "../src/domain/history-stats";

describe("summarizeHistory", () => {
  it("returns zeroed stats for empty history", () => {
    const stats = summarizeHistory([]);
    expect(stats).toEqual({
      total: 0,
      ok: 0,
      error: 0,
      successRatePct: 0,
      avgDurationMs: 0,
      maxDurationMs: 0,
      bySource: {}
    });
  });

  it("aggregates counts and source buckets", () => {
    const stats = summarizeHistory([
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
        result: { ok: false, status: 500, headers: {}, body: "err", durationMs: 20 }
      }
    ]);

    expect(stats.total).toBe(2);
    expect(stats.ok).toBe(1);
    expect(stats.error).toBe(1);
    expect(stats.successRatePct).toBe(50);
    expect(stats.avgDurationMs).toBe(15);
    expect(stats.maxDurationMs).toBe(20);
    expect(stats.bySource.popup).toBe(1);
    expect(stats.bySource.context_menu).toBe(1);
  });
});
