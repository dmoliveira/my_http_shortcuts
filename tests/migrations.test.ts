import { describe, expect, it } from "vitest";
import { APP_CONSTANTS } from "../src/config/constants";
import { migrateState } from "../src/utils/io/migrations";

describe("migrateState", () => {
  it("returns defaults for invalid payloads", () => {
    const result = migrateState(null);
    expect(result.shortcuts).toEqual([]);
    expect(result.history).toEqual([]);
    expect(result.schemaVersion).toBe(APP_CONSTANTS.schemaVersion);
  });

  it("keeps known arrays and updates schema version", () => {
    const result = migrateState({ shortcuts: [{ id: "1" }], history: [{ id: "h" }], schemaVersion: 0 });
    expect(Array.isArray(result.shortcuts)).toBe(true);
    expect(Array.isArray(result.history)).toBe(true);
    expect(result.schemaVersion).toBe(APP_CONSTANTS.schemaVersion);
  });
});
