import { createShortcut } from "../domain/shortcut";
import type { Shortcut } from "../types/api";
import { safeJsonParse } from "../utils/io/serialization";

/**
 * Reads form fields and builds a shortcut payload.
 */
export function readShortcutFromForm(): Shortcut {
  const name = (document.getElementById("name") as HTMLInputElement).value;
  const method = (document.getElementById("method") as HTMLSelectElement).value as Shortcut["method"];
  const url = (document.getElementById("url") as HTMLInputElement).value;
  const headersRaw = (document.getElementById("headers") as HTMLTextAreaElement).value;
  const bodyTemplate = (document.getElementById("body") as HTMLTextAreaElement).value;
  const preScript = (document.getElementById("pre-script") as HTMLTextAreaElement).value;
  const postScript = (document.getElementById("post-script") as HTMLTextAreaElement).value;

  const headers = safeJsonParse<Record<string, string>>(headersRaw) ?? {};
  return createShortcut({ name, method, url, headers, bodyTemplate, preScript, postScript });
}

/**
 * Renders list items for known shortcuts.
 */
export function renderShortcutList(container: HTMLElement, shortcuts: Shortcut[]): void {
  container.innerHTML = "";
  for (const shortcut of shortcuts) {
    const li = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = `${shortcut.name} (${shortcut.method} ${shortcut.url})`;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Delete";
    button.setAttribute("data-action", "delete-shortcut");
    button.setAttribute("data-shortcut-id", shortcut.id);

    li.append(label, button);
    container.append(li);
  }
}
