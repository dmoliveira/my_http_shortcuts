import type { ExecutionContext } from "../types/api";

/**
 * Resolves template placeholders against execution context values.
 */
export function resolveTemplate(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (match, variableName: string) => {
    if (!(variableName in variables)) {
      return match;
    }
    return variables[variableName] ?? "";
  });
}

/**
 * Builds a map of named variables for script hooks.
 */
export function buildVariableMap(context: ExecutionContext): Record<string, string> {
  return {
    input: context.input,
    pageUrl: context.pageUrl
  };
}
