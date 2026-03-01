/**
 * Describes a shortcut that can be executed from the extension.
 */
export interface Shortcut {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  bodyTemplate: string;
  preScript: string;
  postScript: string;
}

/**
 * Lists HTTP methods supported in this project.
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Encapsulates trigger context from popup/options/context menu.
 */
export interface ExecutionContext {
  input: string;
  pageUrl: string;
  variables?: Record<string, string>;
}

/**
 * Represents execution output shown to users and logs.
 */
export interface ExecutionResult {
  ok: boolean;
  status: number;
  headers: Record<string, string>;
  body: string;
  durationMs: number;
  error?: string;
}

/**
 * Defines origin of shortcut execution trigger.
 */
export type ExecutionSource = "popup" | "context_menu" | "unknown";

/**
 * Defines shape of messages exchanged with background worker.
 */
export type RuntimeMessage =
  | { type: "shortcuts:list" }
  | { type: "shortcuts:save"; payload: Shortcut }
  | { type: "shortcuts:delete"; payload: { shortcutId: string } }
  | { type: "shortcut:run"; payload: { shortcutId: string; context: ExecutionContext } }
  | { type: "history:list" }
  | { type: "history:stats" }
  | { type: "history:clear" }
  | { type: "settings:get" }
  | { type: "settings:update"; payload: { defaultContextShortcutId: string | null } }
  | { type: "state:export" }
  | { type: "state:import"; payload: { json: string } };
