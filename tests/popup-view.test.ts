import { describe, expect, it } from "vitest";
import { renderHistoryStats, renderPopupStatus, setButtonsBusy } from "../src/popup/popup-view";

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
});
