/**
 * Defines default values for popup history controls.
 */
export const DEFAULT_POPUP_HISTORY_CONTROLS = {
  filter: "all",
  maxItems: "10"
} as const;

/**
 * Reads popup history control values.
 */
export function readPopupHistoryControls(elements: {
  filter: HTMLSelectElement;
  maxItems: HTMLSelectElement;
}): { filter: string; maxItems: number } {
  const maxParsed = Number(elements.maxItems.value);

  return {
    filter: elements.filter.value,
    maxItems: Number.isFinite(maxParsed) && maxParsed > 0 ? maxParsed : Number(DEFAULT_POPUP_HISTORY_CONTROLS.maxItems)
  };
}

/**
 * Resets popup history controls to defaults.
 */
export function resetPopupHistoryControls(elements: {
  filter: HTMLSelectElement;
  maxItems: HTMLSelectElement;
}): void {
  elements.filter.value = DEFAULT_POPUP_HISTORY_CONTROLS.filter;
  elements.maxItems.value = DEFAULT_POPUP_HISTORY_CONTROLS.maxItems;
}
