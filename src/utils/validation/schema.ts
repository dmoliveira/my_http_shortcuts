import type { Shortcut } from "../../types/api";
import { AppError } from "./errors";

/**
 * Validates shortcut integrity and throws on invalid data.
 */
export function assertShortcutValid(shortcut: Shortcut): void {
  if (!shortcut.id.trim()) {
    throw new AppError("SHORTCUT_ID_REQUIRED", "Shortcut id is required");
  }
  if (!shortcut.name.trim()) {
    throw new AppError("SHORTCUT_NAME_REQUIRED", "Shortcut name is required");
  }
  if (!/^https?:\/\//.test(shortcut.url)) {
    throw new AppError("SHORTCUT_URL_INVALID", "Shortcut URL must start with http:// or https://");
  }
}
