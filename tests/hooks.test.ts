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

  it("rejects non-object pre script output", () => {
    expect(() => runPreScript("function transform(){ return 7; }", { input: "hello" })).toThrowError(
      /Pre script must return an object map/
    );
  });

  it("rejects non-string pre script values", () => {
    expect(() =>
      runPreScript("function transform(input){ return { ...input, retries: 3 }; }", { input: "hello" })
    ).toThrowError(/Pre script variables must be string values/);
  });

  it("rejects non-string post script output", () => {
    expect(() => runPostScript("function transform(){ return { ok: true }; }", "hello")).toThrowError(
      /Post script must return a string response/
    );
  });
});
