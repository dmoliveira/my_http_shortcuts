import { describe, expect, it } from "vitest";
import { redactHeaders, redactSecrets } from "../src/utils/log/redact";

describe("redaction", () => {
  it("masks header secrets", () => {
    const output = redactHeaders({ Authorization: "Bearer abc", "X-Token": "123" });
    expect(output.Authorization).toBe("***");
    expect(output["X-Token"]).toBe("***");
  });

  it("masks token text patterns", () => {
    const output = redactSecrets('{"token":"abc"}');
    expect(output).toContain('"token":"***');
  });
});
