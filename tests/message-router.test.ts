import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "../src/utils/validation/errors";

const mocks = vi.hoisted(() => ({
  loadState: vi.fn(),
  saveState: vi.fn(),
  executeShortcut: vi.fn(),
  createShortcut: vi.fn(),
  assertShortcutValid: vi.fn(),
  summarizeHistory: vi.fn(),
  resolveDefaultContextShortcutId: vi.fn(),
  exportStateJson: vi.fn(),
  importStateJson: vi.fn()
}));

vi.mock("../src/utils/io/storage", () => ({
  loadState: mocks.loadState,
  saveState: mocks.saveState
}));

vi.mock("../src/background/executor", () => ({
  executeShortcut: mocks.executeShortcut
}));

vi.mock("../src/domain/shortcut", () => ({
  createShortcut: mocks.createShortcut
}));

vi.mock("../src/utils/validation/schema", () => ({
  assertShortcutValid: mocks.assertShortcutValid
}));

vi.mock("../src/domain/history-stats", () => ({
  summarizeHistory: mocks.summarizeHistory
}));

vi.mock("../src/domain/settings", () => ({
  resolveDefaultContextShortcutId: mocks.resolveDefaultContextShortcutId
}));

vi.mock("../src/utils/io/portability", () => ({
  exportStateJson: mocks.exportStateJson,
  importStateJson: mocks.importStateJson
}));

import { handleRuntimeMessage } from "../src/background/message-router";

const baseState = {
  shortcuts: [
    {
      id: "s1",
      name: "One",
      method: "GET" as const,
      url: "https://example.com",
      headers: {},
      bodyTemplate: "",
      preScript: "",
      postScript: ""
    }
  ],
  history: [],
  settings: { defaultContextShortcutId: "s1" },
  version: 1
};

describe("handleRuntimeMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.loadState.mockResolvedValue(baseState);
  });

  it("returns shortcuts for shortcuts:list", async () => {
    const result = await handleRuntimeMessage({ type: "shortcuts:list" });
    expect(result).toEqual(baseState.shortcuts);
  });

  it("clears history for history:clear", async () => {
    const result = await handleRuntimeMessage({ type: "history:clear" });
    expect(result).toEqual({ cleared: true });
    expect(mocks.saveState).toHaveBeenCalledWith({ ...baseState, history: [] });
  });

  it("delegates shortcut execution with popup source", async () => {
    mocks.executeShortcut.mockResolvedValue({ ok: true, status: 200, headers: {}, body: "ok", durationMs: 1 });

    const result = await handleRuntimeMessage({
      type: "shortcut:run",
      payload: {
        shortcutId: "s1",
        context: { input: "hello", pageUrl: "https://example.com" }
      }
    });

    expect(mocks.executeShortcut).toHaveBeenCalledWith("s1", { input: "hello", pageUrl: "https://example.com" }, "popup");
    expect(result).toEqual({ ok: true, status: 200, headers: {}, body: "ok", durationMs: 1 });
  });

  it("self-heals default context shortcut on delete", async () => {
    mocks.resolveDefaultContextShortcutId.mockReturnValue(null);

    const result = await handleRuntimeMessage({
      type: "shortcuts:delete",
      payload: { shortcutId: "s1" }
    });

    expect(result).toEqual({ deleted: true });
    expect(mocks.saveState).toHaveBeenCalledWith({
      ...baseState,
      shortcuts: [],
      settings: { defaultContextShortcutId: null }
    });
  });

  it("throws typed error for invalid state import payload", async () => {
    mocks.importStateJson.mockReturnValue(null);

    await expect(
      handleRuntimeMessage({
        type: "state:import",
        payload: { json: "not-json" }
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
