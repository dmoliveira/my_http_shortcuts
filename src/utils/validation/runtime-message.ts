import type { RuntimeMessage } from "../../types/api";

const VALID_RUNTIME_TYPES = new Set<RuntimeMessage["type"]>([
  "shortcuts:list",
  "shortcuts:save",
  "shortcuts:delete",
  "shortcut:run",
  "history:list",
  "history:stats",
  "history:clear",
  "settings:get",
  "settings:update",
  "state:export",
  "state:import"
]);

/**
 * Checks whether a value is a plain string map.
 */
function isStringRecord(value: unknown): value is Record<string, string> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every((entry) => typeof entry === "string");
}

/**
 * Validates payload shape for runtime messages that require payload.
 */
function hasValidPayload(candidate: { type?: unknown; payload?: unknown }): boolean {
  if (candidate.type === "shortcut:run") {
    if (typeof candidate.payload !== "object" || candidate.payload === null) {
      return false;
    }
    const payload = candidate.payload as {
      shortcutId?: unknown;
      context?: { input?: unknown; pageUrl?: unknown; variables?: unknown };
    };
    if (typeof payload.shortcutId !== "string") {
      return false;
    }
    if (typeof payload.context !== "object" || payload.context === null) {
      return false;
    }
    if (typeof payload.context.input !== "string" || typeof payload.context.pageUrl !== "string") {
      return false;
    }
    if (payload.context.variables !== undefined && !isStringRecord(payload.context.variables)) {
      return false;
    }
  }

  if (candidate.type === "shortcuts:delete") {
    if (typeof candidate.payload !== "object" || candidate.payload === null) {
      return false;
    }
    const payload = candidate.payload as { shortcutId?: unknown };
    if (typeof payload.shortcutId !== "string") {
      return false;
    }
  }

  if (candidate.type === "settings:update") {
    if (typeof candidate.payload !== "object" || candidate.payload === null) {
      return false;
    }
    const payload = candidate.payload as { defaultContextShortcutId?: unknown };
    if (!(typeof payload.defaultContextShortcutId === "string" || payload.defaultContextShortcutId === null)) {
      return false;
    }
  }

  if (candidate.type === "state:import") {
    if (typeof candidate.payload !== "object" || candidate.payload === null) {
      return false;
    }
    const payload = candidate.payload as { json?: unknown };
    if (typeof payload.json !== "string") {
      return false;
    }
  }

  return true;
}

/**
 * Returns true when unknown value has a known runtime message type.
 */
export function isRuntimeMessage(value: unknown): value is RuntimeMessage {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as { type?: unknown; payload?: unknown };
  if (!(typeof candidate.type === "string" && VALID_RUNTIME_TYPES.has(candidate.type as RuntimeMessage["type"]))) {
    return false;
  }

  return hasValidPayload(candidate);
}
