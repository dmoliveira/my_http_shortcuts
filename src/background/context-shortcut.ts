import type { Shortcut } from "../types/api";

/**
 * Chooses context-menu target shortcut with configured-id fallback.
 */
export function selectContextShortcut(
  shortcuts: Shortcut[],
  defaultContextShortcutId: string | null
): Shortcut | null {
  if (defaultContextShortcutId) {
    const configured = shortcuts.find((shortcut) => shortcut.id === defaultContextShortcutId) ?? null;
    if (configured) {
      return configured;
    }
  }

  return shortcuts[0] ?? null;
}
