import { describe, expect, it } from "vitest";
import { renderPopupStatus, setButtonsBusy } from "../src/popup/popup-view";

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
});
