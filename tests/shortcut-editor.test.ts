import { describe, expect, it } from "vitest";
import { parseHeadersJson } from "../src/options/shortcut-editor";

describe("parseHeadersJson", () => {
  it("parses object payloads and normalizes values", () => {
    const headers = parseHeadersJson('{"x-id":123,"x-name":"ok"}');
    expect(headers).toEqual({ "x-id": "123", "x-name": "ok" });
  });

  it("throws on invalid JSON shape", () => {
    expect(() => parseHeadersJson("[]")).toThrowError(/JSON object/);
    expect(() => parseHeadersJson("null")).toThrowError(/JSON object/);
  });
});
