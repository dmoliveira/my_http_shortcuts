import { describe, expect, it } from "vitest";
import { isRuntimeMessage } from "../src/utils/validation/runtime-message";

describe("isRuntimeMessage", () => {
  it("accepts known message types", () => {
    expect(isRuntimeMessage({ type: "shortcuts:list" })).toBe(true);
    expect(isRuntimeMessage({ type: "history:stats" })).toBe(true);
    expect(isRuntimeMessage({ type: "settings:update", payload: { defaultContextShortcutId: null } })).toBe(true);
    expect(
      isRuntimeMessage({
        type: "shortcut:run",
        payload: {
          shortcutId: "s1",
          context: {
            input: "hello",
            pageUrl: "https://example.com",
            variables: { apiToken: "secret" }
          }
        }
      })
    ).toBe(true);
  });

  it("rejects unknown message values", () => {
    expect(isRuntimeMessage({ type: "unknown" })).toBe(false);
    expect(isRuntimeMessage(null)).toBe(false);
    expect(isRuntimeMessage("shortcuts:list")).toBe(false);
  });

  it("rejects invalid payload shapes for known types", () => {
    expect(isRuntimeMessage({ type: "state:import", payload: { json: 7 } })).toBe(false);
    expect(isRuntimeMessage({ type: "shortcuts:delete", payload: { shortcutId: 1 } })).toBe(false);
    expect(
      isRuntimeMessage({
        type: "shortcut:run",
        payload: {
          shortcutId: "s1",
          context: { input: "x", pageUrl: "https://example.com", variables: { tries: 3 } }
        }
      })
    ).toBe(false);
  });
});
