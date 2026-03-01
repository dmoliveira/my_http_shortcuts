import { APP_CONSTANTS } from "../../config/constants";
import { getDefaultState } from "../../config/defaults";
import { createShortcut } from "../../domain/shortcut";
import { resolveDefaultContextShortcutId } from "../../domain/settings";
import type { PersistedState } from "../../types/storage";
import { assertShortcutValid } from "../validation/schema";

/**
 * Checks whether an unknown value is a plain object.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Normalizes unknown shortcut entries and filters invalid values.
 */
function normalizeShortcuts(value: unknown): PersistedState["shortcuts"] {
  if (!Array.isArray(value)) {
    return [];
  }

  const shortcuts = [] as PersistedState["shortcuts"];
  for (const item of value) {
    if (!isRecord(item)) {
      continue;
    }

    const shortcut = createShortcut({
      id: typeof item.id === "string" ? item.id : undefined,
      name: typeof item.name === "string" ? item.name : "",
      method:
        item.method === "GET" ||
        item.method === "POST" ||
        item.method === "PUT" ||
        item.method === "PATCH" ||
        item.method === "DELETE"
          ? item.method
          : "GET",
      url: typeof item.url === "string" ? item.url : "",
      headers: isRecord(item.headers)
        ? Object.fromEntries(Object.entries(item.headers).map(([k, v]) => [k, String(v)]))
        : {},
      bodyTemplate: typeof item.bodyTemplate === "string" ? item.bodyTemplate : "",
      preScript: typeof item.preScript === "string" ? item.preScript : "",
      postScript: typeof item.postScript === "string" ? item.postScript : ""
    });

    try {
      assertShortcutValid(shortcut);
      shortcuts.push(shortcut);
    } catch {
      continue;
    }
  }

  return shortcuts;
}

/**
 * Normalizes unknown history entries and filters invalid values.
 */
function normalizeHistory(value: unknown): PersistedState["history"] {
  if (!Array.isArray(value)) {
    return [];
  }

  const history = [] as PersistedState["history"];
  for (const item of value) {
    if (!isRecord(item) || !isRecord(item.result)) {
      continue;
    }

    history.push({
      id: typeof item.id === "string" ? item.id : crypto.randomUUID(),
      shortcutId: typeof item.shortcutId === "string" ? item.shortcutId : "",
      shortcutName: typeof item.shortcutName === "string" ? item.shortcutName : "Unknown",
      createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
      correlationId: typeof item.correlationId === "string" ? item.correlationId : `${Date.now()}-${crypto.randomUUID()}`,
      result: {
        ok: Boolean(item.result.ok),
        status: typeof item.result.status === "number" ? item.result.status : 0,
        headers: isRecord(item.result.headers)
          ? Object.fromEntries(Object.entries(item.result.headers).map(([k, v]) => [k, String(v)]))
          : {},
        body: typeof item.result.body === "string" ? item.result.body : "",
        durationMs: typeof item.result.durationMs === "number" ? item.result.durationMs : 0,
        error: typeof item.result.error === "string" ? item.result.error : undefined
      }
    });
  }

  return history;
}

/**
 * Normalizes unknown settings payload into current settings model.
 */
function normalizeSettings(value: unknown): PersistedState["settings"] {
  if (!isRecord(value)) {
    return { defaultContextShortcutId: null };
  }

  return {
    defaultContextShortcutId:
      typeof value.defaultContextShortcutId === "string" ? value.defaultContextShortcutId : null
  };
}

/**
 * Migrates persisted payloads into the current storage schema.
 */
export function migrateState(value: unknown): PersistedState {
  if (!isRecord(value)) {
    return getDefaultState();
  }

  const shortcuts = normalizeShortcuts(value.shortcuts);
  const history = normalizeHistory(value.history);
  const settingsRaw = normalizeSettings(value.settings);
  const settings = {
    defaultContextShortcutId: resolveDefaultContextShortcutId(shortcuts, settingsRaw.defaultContextShortcutId)
  };

  return {
    shortcuts,
    history,
    settings,
    schemaVersion: APP_CONSTANTS.schemaVersion
  } as PersistedState;
}
