/**
 * Defines default values for options history filters.
 */
export const DEFAULT_HISTORY_FILTERS = {
  source: "all",
  result: "all",
  query: "",
  sort: "newest",
  maxItems: "20",
  minDurationMs: "0"
} as const;

/**
 * Reads history filter values from options controls.
 */
export function readHistoryFilters(elements: {
  source: HTMLSelectElement;
  result: HTMLSelectElement;
  query: HTMLInputElement;
  sort: HTMLSelectElement;
  maxItems: HTMLSelectElement;
  minDurationMs: HTMLInputElement;
}): {
  source: string;
  result: string;
  query: string;
  sort: string;
  maxItems: number;
  minDurationMs: number;
} {
  return {
    source: elements.source.value,
    result: elements.result.value,
    query: elements.query.value,
    sort: elements.sort.value,
    maxItems: Number(elements.maxItems.value),
    minDurationMs: Number(elements.minDurationMs.value)
  };
}

/**
 * Restores history filter controls to default values.
 */
export function resetHistoryFilters(elements: {
  source: HTMLSelectElement;
  result: HTMLSelectElement;
  query: HTMLInputElement;
  sort: HTMLSelectElement;
  maxItems: HTMLSelectElement;
  minDurationMs: HTMLInputElement;
}): void {
  elements.source.value = DEFAULT_HISTORY_FILTERS.source;
  elements.result.value = DEFAULT_HISTORY_FILTERS.result;
  elements.query.value = DEFAULT_HISTORY_FILTERS.query;
  elements.sort.value = DEFAULT_HISTORY_FILTERS.sort;
  elements.maxItems.value = DEFAULT_HISTORY_FILTERS.maxItems;
  elements.minDurationMs.value = DEFAULT_HISTORY_FILTERS.minDurationMs;
}
