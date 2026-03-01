import { describe, expect, it } from "vitest";
import { assertShortcutValid } from "../src/utils/validation/schema";

describe("assertShortcutValid", () => {
  it("accepts valid shortcuts", () => {
    expect(() =>
      assertShortcutValid({
        id: "1",
        name: "Ping",
        method: "GET",
        url: "https://example.com",
        headers: {},
        bodyTemplate: "",
        preScript: "",
        postScript: ""
      })
    ).not.toThrow();
  });

  it("rejects invalid URL", () => {
    expect(() =>
      assertShortcutValid({
        id: "1",
        name: "Bad",
        method: "GET",
        url: "ftp://example.com",
        headers: {},
        bodyTemplate: "",
        preScript: "",
        postScript: ""
      })
    ).toThrowError(/URL must start/);
  });
});
