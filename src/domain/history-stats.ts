import type { HistoryItem, HistoryStats } from "../types/storage";

/**
 * Aggregates execution history into summary metrics.
 */
export function summarizeHistory(items: HistoryItem[]): HistoryStats {
  const stats: HistoryStats = {
    total: items.length,
    ok: 0,
    error: 0,
    bySource: {}
  };

  for (const item of items) {
    if (item.result.ok) {
      stats.ok += 1;
    } else {
      stats.error += 1;
    }
    stats.bySource[item.source] = (stats.bySource[item.source] ?? 0) + 1;
  }

  return stats;
}
