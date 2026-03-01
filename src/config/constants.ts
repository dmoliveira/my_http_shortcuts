/**
 * Declares extension-wide constants used by runtime modules.
 */
export const APP_CONSTANTS = {
  appName: "my_http_shortcuts",
  schemaVersion: 1,
  historyLimit: 50,
  defaultTimeoutMs: 15000,
  defaultRetryCount: 1,
  defaultRetryDelayMs: 300,
  storageKey: "my_http_shortcuts_state"
} as const;
