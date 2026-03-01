import { describe, expect, it } from "vitest";
import { APP_CONSTANTS } from "../src/config/constants";
import { migrateState } from "../src/utils/io/migrations";

describe("migrateState", () => {
  it("returns defaults for invalid payloads", () => {
    const result = migrateState(null);
    expect(result.shortcuts).toEqual([]);
    expect(result.history).toEqual([]);
    expect(result.settings.defaultContextShortcutId).toBeNull();
    expect(result.schemaVersion).toBe(APP_CONSTANTS.schemaVersion);
  });

  it("keeps known arrays and updates schema version", () => {
    const result = migrateState({
      shortcuts: [
        { id: "1", name: "Ping", method: "GET", url: "https://example.com", headers: {} },
        { id: "2", name: "Bad", method: "GET", url: "ftp://example.com" }
      ],
      history: [{ id: "h", result: { ok: true, status: 200, headers: {}, body: "ok", durationMs: 10 } }],
      settings: { defaultContextShortcutId: "2" },
      schemaVersion: 0
    });

    expect(Array.isArray(result.shortcuts)).toBe(true);
    expect(Array.isArray(result.history)).toBe(true);
    expect(result.shortcuts).toHaveLength(1);
    expect(result.shortcuts[0]?.id).toBe("1");
    expect(result.history[0]?.id).toBe("h");
    expect(result.settings.defaultContextShortcutId).toBeNull();
    expect(result.schemaVersion).toBe(APP_CONSTANTS.schemaVersion);
  });
});
