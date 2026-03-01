import { APP_CONSTANTS } from "../config/constants";
import type { ExecutionResult } from "../types/api";

/**
 * Builds a storage-safe execution result for history persistence.
 */
export function buildHistoryResult(result: ExecutionResult): ExecutionResult {
  const body =
    result.body.length <= APP_CONSTANTS.historyBodyLimitChars
      ? result.body
      : `${result.body.slice(0, APP_CONSTANTS.historyBodyLimitChars)}\n... [history truncated]`;

  return {
    ...result,
    body
  };
}
