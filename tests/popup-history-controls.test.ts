import { describe, expect, it } from "vitest";
import {
  DEFAULT_POPUP_HISTORY_CONTROLS,
  readPopupHistoryControls,
  resetPopupHistoryControls
} from "../src/popup/history-controls";

describe("popup history controls", () => {
  it("reads control values", () => {
    const filter = document.createElement("select");
    filter.innerHTML = '<option value="error">Errors</option>';
    filter.value = "error";

    const maxItems = document.createElement("select");
    maxItems.innerHTML = '<option value="5">5</option>';
    maxItems.value = "5";

    const values = readPopupHistoryControls({ filter, maxItems });
    expect(values).toEqual({ filter: "error", maxItems: 5 });
  });

  it("falls back to default max items when invalid", () => {
    const filter = document.createElement("select");
    filter.innerHTML = '<option value="all">All</option>';
    filter.value = "all";

    const maxItems = document.createElement("select");
    maxItems.innerHTML = '<option value="10">10</option>';
    maxItems.value = "-1";

    const values = readPopupHistoryControls({ filter, maxItems });
    expect(values.maxItems).toBe(Number(DEFAULT_POPUP_HISTORY_CONTROLS.maxItems));
  });

  it("resets controls to defaults", () => {
    const filter = document.createElement("select");
    filter.innerHTML = '<option value="all">All</option>';
    filter.value = "error";

    const maxItems = document.createElement("select");
    maxItems.innerHTML = '<option value="10">10</option>';
    maxItems.value = "20";

    resetPopupHistoryControls({ filter, maxItems });
    expect(filter.value).toBe(DEFAULT_POPUP_HISTORY_CONTROLS.filter);
    expect(maxItems.value).toBe(DEFAULT_POPUP_HISTORY_CONTROLS.maxItems);
  });
});
