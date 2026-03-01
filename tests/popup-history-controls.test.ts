import { describe, expect, it } from "vitest";
import {
  DEFAULT_POPUP_HISTORY_CONTROLS,
  readPopupHistoryControls,
  resetPopupHistoryControls
} from "../src/popup/history-controls";

function makeSelect(value: string): HTMLSelectElement {
  return { value, innerHTML: "", append: () => undefined } as unknown as HTMLSelectElement;
}

describe("popup history controls", () => {
  it("reads control values", () => {
    const filter = makeSelect("error");

    const maxItems = makeSelect("5");

    const values = readPopupHistoryControls({ filter, maxItems });
    expect(values).toEqual({ filter: "error", maxItems: 5 });
  });

  it("falls back to default max items when invalid", () => {
    const filter = makeSelect("all");

    const maxItems = makeSelect("-1");

    const values = readPopupHistoryControls({ filter, maxItems });
    expect(values.maxItems).toBe(Number(DEFAULT_POPUP_HISTORY_CONTROLS.maxItems));
  });

  it("resets controls to defaults", () => {
    const filter = makeSelect("error");

    const maxItems = makeSelect("20");

    resetPopupHistoryControls({ filter, maxItems });
    expect(filter.value).toBe(DEFAULT_POPUP_HISTORY_CONTROLS.filter);
    expect(maxItems.value).toBe(DEFAULT_POPUP_HISTORY_CONTROLS.maxItems);
  });
});
