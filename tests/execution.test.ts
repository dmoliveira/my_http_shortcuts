import { describe, expect, it } from "vitest";
import { buildVariableMap, resolveTemplate } from "../src/domain/execution";

describe("resolveTemplate", () => {
  it("replaces context placeholders", () => {
    const output = resolveTemplate("URL={{pageUrl}} input={{input}}", {
      input: "hello",
      pageUrl: "https://example.com"
    });

    expect(output).toBe("URL=https://example.com input=hello");
  });

  it("replaces custom placeholders from variable maps", () => {
    const output = resolveTemplate("token={{apiToken}}", {
      apiToken: "secret-token"
    });

    expect(output).toBe("token=secret-token");
  });

  it("keeps unknown placeholders unchanged", () => {
    const output = resolveTemplate("missing={{unknown}}", {
      input: "hello"
    });

    expect(output).toBe("missing={{unknown}}");
  });
});

describe("buildVariableMap", () => {
  it("maps execution context to variable map", () => {
    const variables = buildVariableMap({
      input: "hello",
      pageUrl: "https://example.com"
    });

    expect(variables).toEqual({
      input: "hello",
      pageUrl: "https://example.com"
    });
  });
});
