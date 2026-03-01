import { APP_CONSTANTS } from "../config/constants";
import { buildVariableMap, resolveTemplate } from "../domain/execution";
import { pushHistory } from "../domain/history";
import { getShortcutById } from "../domain/shortcut";
import { runPostScript, runPreScript } from "../scripts/hooks";
import type { ExecutionContext, ExecutionResult, ExecutionSource } from "../types/api";
import type { HistoryItem } from "../types/storage";
import { loadState, saveState } from "../utils/io/storage";
import { createCorrelationId, logError, logInfo } from "../utils/log/logger";
import { buildRequestInit } from "../utils/net/request-builder";
import { fetchWithTimeout } from "../utils/net/timeout";
import { AppError } from "../utils/validation/errors";
import { mapExecutionError } from "./error-map";
import { buildHistoryResult } from "./history-payload";
import { runWithRetry } from "./retry";

/**
 * Executes one configured shortcut by id using provided context.
 */
export async function executeShortcut(
  shortcutId: string,
  context: ExecutionContext,
  source: ExecutionSource = "popup"
): Promise<ExecutionResult> {
  const startedAt = Date.now();
  const correlationId = createCorrelationId();
  const state = await loadState();
  const shortcut = getShortcutById(state.shortcuts, shortcutId);

  if (!shortcut) {
    throw new AppError("SHORTCUT_NOT_FOUND", "Shortcut was not found");
  }

  try {
    logInfo(correlationId, "Execution started", { shortcutId });
    const baseVariables = buildVariableMap(context);
    const variables = runPreScript(shortcut.preScript, baseVariables);
    const templateVariables = { ...baseVariables, ...variables };
    const resolvedUrl = resolveTemplate(shortcut.url, templateVariables);
    const resolvedBody = resolveTemplate(shortcut.bodyTemplate, templateVariables);

    const response = await runWithRetry(
      async () =>
        fetchWithTimeout(
          resolvedUrl,
          buildRequestInit(shortcut, resolvedBody),
          APP_CONSTANTS.defaultTimeoutMs
        ),
      APP_CONSTANTS.defaultRetryCount,
      APP_CONSTANTS.defaultRetryDelayMs
    );
    const body = runPostScript(shortcut.postScript, await response.text());
    const result: ExecutionResult = {
      ok: response.ok,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body,
      durationMs: Date.now() - startedAt
    };

    const historyItem: HistoryItem = {
      id: crypto.randomUUID(),
      shortcutId: shortcut.id,
      shortcutName: shortcut.name,
      source,
      createdAt: new Date().toISOString(),
      correlationId,
      result: buildHistoryResult(result)
    };

    await saveState({ ...state, history: pushHistory(state.history, historyItem) });
    return result;
  } catch (error) {
    logError(correlationId, "Execution failed", error);
    return mapExecutionError(error, Date.now() - startedAt);
  }
}
