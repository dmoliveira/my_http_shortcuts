import { describe, expect, it } from "vitest";
import {
  filterPopupHistory,
  limitPopupHistory,
  renderHistoryStats,
  renderPopupStatus,
  setButtonsBusy
} from "../src/popup/popup-view";

describe("popup view helpers", () => {
  it("renders status text", () => {
    const status = document.createElement("p");
    renderPopupStatus(status, "Running");
    expect(status.textContent).toBe("Running");
  });

  it("toggles busy state for buttons", () => {
    const a = document.createElement("button");
    const b = document.createElement("button");

    setButtonsBusy([a, b], true);
    expect(a.disabled).toBe(true);
    expect(b.disabled).toBe(true);

    setButtonsBusy([a, b], false);
    expect(a.disabled).toBe(false);
    expect(b.disabled).toBe(false);
  });

  it("renders compact history stats line", () => {
    const stats = document.createElement("p");
    renderHistoryStats(stats, {
      total: 3,
      ok: 2,
      error: 1,
      successRatePct: 67,
      avgDurationMs: 40,
      maxDurationMs: 91,
      bySource: { popup: 2, context_menu: 1 }
    });
    expect(stats.textContent).toBe("Total: 3 | OK: 2 | ERR: 1 | success: 67% | avg: 40ms | max: 91ms");
  });

  it("filters popup history to errors only", () => {
    const filtered = filterPopupHistory(
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
          source: "popup",
          createdAt: "2026-03-01T00:00:00.000Z",
          correlationId: "c2",
          result: { ok: false, status: 500, headers: {}, body: "err", durationMs: 20 }
        }
      ],
      "error"
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.id).toBe("2");
  });

  it("limits popup history entries", () => {
    const limited = limitPopupHistory(
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
          source: "popup",
          createdAt: "2026-03-01T00:00:01.000Z",
          correlationId: "c2",
          result: { ok: false, status: 500, headers: {}, body: "err", durationMs: 20 }
        }
      ],
      1
    );

    expect(limited).toHaveLength(1);
    expect(limited[0]?.id).toBe("1");
  });
});
