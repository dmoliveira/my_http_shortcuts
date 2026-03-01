import { describe, expect, it } from "vitest";
import { resolveDefaultContextShortcutId } from "../src/domain/settings";

const shortcuts = [
  {
    id: "a",
    name: "A",
    method: "GET" as const,
    url: "https://example.com/a",
    headers: {},
    bodyTemplate: "",
    preScript: "",
    postScript: ""
  }
];

describe("resolveDefaultContextShortcutId", () => {
  it("keeps existing shortcut id", () => {
    expect(resolveDefaultContextShortcutId(shortcuts, "a")).toBe("a");
  });

  it("returns null for missing shortcut id", () => {
    expect(resolveDefaultContextShortcutId(shortcuts, "missing")).toBeNull();
  });

  it("returns null for empty candidate", () => {
    expect(resolveDefaultContextShortcutId(shortcuts, null)).toBeNull();
  });
});
