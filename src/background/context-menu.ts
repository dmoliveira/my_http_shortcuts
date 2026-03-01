import type { ExecutionContext } from "../types/api";

/**
 * Builds execution context from context-menu click payload.
 */
export function buildContextMenuExecutionContext(selectionText: string | undefined, pageUrl: string | undefined): ExecutionContext {
  return {
    input: selectionText ?? "",
    pageUrl: pageUrl ?? ""
  };
}
