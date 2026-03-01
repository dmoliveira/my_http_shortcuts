/**
 * Renders shortcut options into the popup select element.
 */
export function renderShortcutOptions(
  selectElement: HTMLSelectElement,
  shortcuts: Array<{ id: string; name: string }>
): void {
  selectElement.innerHTML = "";
  for (const shortcut of shortcuts) {
    const option = document.createElement("option");
    option.value = shortcut.id;
    option.textContent = shortcut.name;
    selectElement.append(option);
  }
}

/**
 * Renders execution results in a readable text block.
 */
export function renderResult(preElement: HTMLElement, result: unknown): void {
  preElement.textContent = JSON.stringify(result, null, 2);
}
