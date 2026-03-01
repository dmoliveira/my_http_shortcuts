import type { Shortcut } from "../types/api";

/**
 * Builds a new shortcut model from form-like values.
 */
export function createShortcut(input: Partial<Shortcut>): Shortcut {
  return {
    id: input.id ?? crypto.randomUUID(),
    name: input.name ?? "",
    method: input.method ?? "GET",
    url: input.url ?? "",
    headers: input.headers ?? {},
    bodyTemplate: input.bodyTemplate ?? "",
    preScript: input.preScript ?? "",
    postScript: input.postScript ?? ""
  };
}

/**
 * Finds a shortcut by id from an array.
 */
export function getShortcutById(shortcuts: Shortcut[], id: string): Shortcut | null {
  return shortcuts.find((shortcut) => shortcut.id === id) ?? null;
}
