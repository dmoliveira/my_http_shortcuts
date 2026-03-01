import { describe, expect, it } from "vitest";
import { runPostScript, runPreScript } from "../src/scripts/hooks";

describe("script hooks", () => {
  it("returns inputs unchanged when script is empty", () => {
    expect(runPreScript("", { input: "a" })).toEqual({ input: "a" });
    expect(runPostScript("", "body")).toBe("body");
  });

  it("uses transform function output when provided", () => {
    const pre = runPreScript(
      "function transform(input){ return { ...input, input: input.input.toUpperCase() }; }",
      { input: "hello", pageUrl: "x" }
    );
    const post = runPostScript("function transform(input){ return input + ' world'; }", "hello");

    expect(pre.input).toBe("HELLO");
    expect(post).toBe("hello world");
  });
});
