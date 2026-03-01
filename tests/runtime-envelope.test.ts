import { describe, expect, it } from "vitest";
import { parseRuntimeEnvelope } from "../src/utils/io/runtime-envelope";

describe("parseRuntimeEnvelope", () => {
  it("accepts valid envelopes", () => {
    const result = parseRuntimeEnvelope({ ok: true, result: { value: 1 } });
    expect(result.ok).toBe(true);
    expect(result.result).toEqual({ value: 1 });
  });

  it("throws on missing ok field", () => {
    expect(() => parseRuntimeEnvelope({ result: {} })).toThrowError(/missing 'ok'/);
  });

  it("throws when payload is not object", () => {
    expect(() => parseRuntimeEnvelope(null)).toThrowError(/not an object/);
  });
});
