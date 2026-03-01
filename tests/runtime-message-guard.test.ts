import { describe, expect, it } from "vitest";
import { isRuntimeMessage } from "../src/utils/validation/runtime-message";

describe("isRuntimeMessage", () => {
  it("accepts known message types", () => {
    expect(isRuntimeMessage({ type: "shortcuts:list" })).toBe(true);
    expect(isRuntimeMessage({ type: "settings:update", payload: { defaultContextShortcutId: null } })).toBe(true);
  });

  it("rejects unknown message values", () => {
    expect(isRuntimeMessage({ type: "unknown" })).toBe(false);
    expect(isRuntimeMessage(null)).toBe(false);
    expect(isRuntimeMessage("shortcuts:list")).toBe(false);
  });
});
