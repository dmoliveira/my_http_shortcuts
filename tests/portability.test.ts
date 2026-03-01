import { describe, expect, it } from "vitest";
import { exportStateJson, importStateJson } from "../src/utils/io/portability";
import { getDefaultState } from "../src/config/defaults";

describe("state portability", () => {
  it("exports and imports state JSON", () => {
    const state = getDefaultState();
    const exported = exportStateJson(state);
    const imported = importStateJson(exported);

    expect(imported).not.toBeNull();
    expect(imported?.shortcuts).toEqual([]);
  });

  it("returns null for malformed JSON", () => {
    expect(importStateJson("{not-json")).toBeNull();
  });
});
