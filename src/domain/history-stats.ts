import type { HistoryItem, HistoryStats } from "../types/storage";

/**
 * Aggregates execution history into summary metrics.
 */
export function summarizeHistory(items: HistoryItem[]): HistoryStats {
  const stats: HistoryStats = {
    total: items.length,
    ok: 0,
    error: 0,
    avgDurationMs: 0,
    maxDurationMs: 0,
    bySource: {}
  };

  let totalDurationMs = 0;

  for (const item of items) {
    if (item.result.ok) {
      stats.ok += 1;
    } else {
      stats.error += 1;
    }
    totalDurationMs += item.result.durationMs;
    stats.maxDurationMs = Math.max(stats.maxDurationMs, item.result.durationMs);
    stats.bySource[item.source] = (stats.bySource[item.source] ?? 0) + 1;
  }

  stats.avgDurationMs = stats.total > 0 ? Math.round(totalDurationMs / stats.total) : 0;

  return stats;
}
