import type { Shortcut } from "../types/api";

/**
 * Renders shortcut choices for default context-menu execution.
 */
export function renderDefaultContextOptions(
  selectElement: HTMLSelectElement,
  shortcuts: Shortcut[],
  selectedShortcutId: string | null
): void {
  selectElement.innerHTML = "";

  const none = document.createElement("option");
  none.value = "";
  none.textContent = "(None)";
  selectElement.append(none);

  for (const shortcut of shortcuts) {
    const option = document.createElement("option");
    option.value = shortcut.id;
    option.textContent = shortcut.name;
    selectElement.append(option);
  }

  selectElement.value = selectedShortcutId ?? "";
}

/**
 * Reads selected default shortcut id from options selector.
 */
export function readDefaultContextSelection(selectElement: HTMLSelectElement): string | null {
  return selectElement.value || null;
}
