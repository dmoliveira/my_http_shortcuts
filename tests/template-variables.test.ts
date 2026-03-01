import { describe, expect, it } from "vitest";
import { extractTemplateVariables, promptTemplateVariables } from "../src/popup/template-variables";

describe("extractTemplateVariables", () => {
  it("returns sorted unique non-reserved variable names", () => {
    const variables = extractTemplateVariables([
      "https://example.com/{{tenant}}/users/{{userId}}",
      "{\"token\":\"{{apiToken}}\",\"id\":\"{{userId}}\"}",
      "{{input}} {{pageUrl}}"
    ]);

    expect(variables).toEqual(["apiToken", "tenant", "userId"]);
  });

  it("returns empty list when no promptable placeholders exist", () => {
    const variables = extractTemplateVariables(["plain text", "{{input}} only"]);
    expect(variables).toEqual([]);
  });
});

describe("promptTemplateVariables", () => {
  it("collects values from prompt function", () => {
    const answers = ["tenant-a", "token-1"];
    const values = promptTemplateVariables(["tenant", "apiToken"], () => answers.shift() ?? "");

    expect(values).toEqual({
      tenant: "tenant-a",
      apiToken: "token-1"
    });
  });

  it("returns null when prompt is cancelled", () => {
    const values = promptTemplateVariables(["tenant"], () => null);
    expect(values).toBeNull();
  });
});
