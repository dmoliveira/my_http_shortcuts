const RESERVED_VARIABLE_NAMES = new Set(["input", "pageUrl"]);
const TEMPLATE_VARIABLE_PATTERN = /\{\{([a-zA-Z0-9_]+)\}\}/g;

/**
 * Extracts promptable variable names from template strings.
 */
export function extractTemplateVariables(templates: string[]): string[] {
  const variables = new Set<string>();

  for (const template of templates) {
    TEMPLATE_VARIABLE_PATTERN.lastIndex = 0;
    let match = TEMPLATE_VARIABLE_PATTERN.exec(template);
    while (match) {
      const variableName = match[1];
      if (variableName && !RESERVED_VARIABLE_NAMES.has(variableName)) {
        variables.add(variableName);
      }
      match = TEMPLATE_VARIABLE_PATTERN.exec(template);
    }
  }

  return Array.from(variables).sort((a, b) => a.localeCompare(b));
}

/**
 * Prompts users for variable values and supports cancellation.
 */
export function promptTemplateVariables(
  variableNames: string[],
  promptFn: (message: string, defaultValue: string) => string | null = window.prompt
): Record<string, string> | null {
  const values: Record<string, string> = {};

  for (const variableName of variableNames) {
    const value = promptFn(`Value for ${variableName}`, "");
    if (value === null) {
      return null;
    }
    values[variableName] = value;
  }

  return values;
}
