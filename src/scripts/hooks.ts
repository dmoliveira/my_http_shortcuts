import { executeScript } from "./sandbox";

/**
 * Runs pre-request script and returns transformed variables.
 */
export function runPreScript(script: string, variables: Record<string, string>): Record<string, string> {
  if (!script.trim()) {
    return variables;
  }
  return executeScript<Record<string, string>, Record<string, string>>(script, variables);
}

/**
 * Runs post-response script and returns transformed response text.
 */
export function runPostScript(script: string, responseBody: string): string {
  if (!script.trim()) {
    return responseBody;
  }
  return executeScript<string, string>(script, responseBody);
}
