import type { ExecutionContext } from "../types/api";

/**
 * Resolves template placeholders against execution context values.
 */
export function resolveTemplate(template: string, context: ExecutionContext): string {
  return template
    .replaceAll("{{input}}", context.input)
    .replaceAll("{{pageUrl}}", context.pageUrl);
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
