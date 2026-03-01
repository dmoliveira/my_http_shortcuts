import { describe, expect, it } from "vitest";
import { selectContextShortcut } from "../src/background/context-shortcut";

const shortcuts = [
  {
    id: "one",
    name: "One",
    method: "GET" as const,
    url: "https://example.com/1",
    headers: {},
    bodyTemplate: "",
    preScript: "",
    postScript: ""
  },
  {
    id: "two",
    name: "Two",
    method: "GET" as const,
    url: "https://example.com/2",
    headers: {},
    bodyTemplate: "",
    preScript: "",
    postScript: ""
  }
];

describe("selectContextShortcut", () => {
  it("selects configured shortcut when present", () => {
    const selected = selectContextShortcut(shortcuts, "two");
    expect(selected?.id).toBe("two");
  });

  it("falls back to first shortcut", () => {
    const selected = selectContextShortcut(shortcuts, "missing");
    expect(selected?.id).toBe("one");
  });

  it("returns null when no shortcuts exist", () => {
    const selected = selectContextShortcut([], null);
    expect(selected).toBeNull();
  });
});
