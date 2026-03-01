import type { RuntimeMessage } from "../../types/api";

const VALID_RUNTIME_TYPES = new Set<RuntimeMessage["type"]>([
  "shortcuts:list",
  "shortcuts:save",
  "shortcuts:delete",
  "shortcut:run",
  "history:list",
  "history:clear",
  "settings:get",
  "settings:update",
  "state:export",
  "state:import"
]);

/**
 * Returns true when unknown value has a known runtime message type.
 */
export function isRuntimeMessage(value: unknown): value is RuntimeMessage {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as { type?: unknown };
  return typeof candidate.type === "string" && VALID_RUNTIME_TYPES.has(candidate.type as RuntimeMessage["type"]);
}
