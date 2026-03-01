import type { Shortcut } from "../types/api";

/**
 * Returns valid default context shortcut id or null.
 */
export function resolveDefaultContextShortcutId(
  shortcuts: Shortcut[],
  candidateId: string | null
): string | null {
  if (!candidateId) {
    return null;
  }

  return shortcuts.some((shortcut) => shortcut.id === candidateId) ? candidateId : null;
}
