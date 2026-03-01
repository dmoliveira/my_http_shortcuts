import { describe, expect, it } from "vitest";
import { resolveTemplate } from "../src/domain/execution";

describe("resolveTemplate", () => {
  it("replaces context placeholders", () => {
    const output = resolveTemplate("URL={{pageUrl}} input={{input}}", {
      input: "hello",
      pageUrl: "https://example.com"
    });

    expect(output).toBe("URL=https://example.com input=hello");
  });
});
