import { describe, expect, it } from "vitest";
import { buildContextMenuExecutionContext } from "../src/background/context-menu";

describe("buildContextMenuExecutionContext", () => {
  it("maps provided values", () => {
    const context = buildContextMenuExecutionContext("hello", "https://example.com");
    expect(context).toEqual({ input: "hello", pageUrl: "https://example.com" });
  });

  it("falls back to empty strings", () => {
    const context = buildContextMenuExecutionContext(undefined, undefined);
    expect(context).toEqual({ input: "", pageUrl: "" });
  });
});
