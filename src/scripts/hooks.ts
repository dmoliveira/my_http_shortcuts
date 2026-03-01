import { executeScript } from "./sandbox";
import { AppError } from "../utils/validation/errors";

/**
 * Validates pre-script output shape for safe variable usage.
 */
function assertPreScriptOutput(output: unknown): asserts output is Record<string, string> {
  if (typeof output !== "object" || output === null || Array.isArray(output)) {
    throw new AppError("SCRIPT_PRE_INVALID_OUTPUT", "Pre script must return an object map");
  }

  for (const [key, value] of Object.entries(output)) {
    if (typeof key !== "string" || typeof value !== "string") {
      throw new AppError("SCRIPT_PRE_INVALID_OUTPUT", "Pre script variables must be string values");
    }
  }
}

/**
 * Validates post-script output for response rendering.
 */
function assertPostScriptOutput(output: unknown): asserts output is string {
  if (typeof output !== "string") {
    throw new AppError("SCRIPT_POST_INVALID_OUTPUT", "Post script must return a string response");
  }
}

/**
 * Runs pre-request script and returns transformed variables.
 */
export function runPreScript(script: string, variables: Record<string, string>): Record<string, string> {
  if (!script.trim()) {
    return variables;
  }

  try {
    const output = executeScript<Record<string, string>, unknown>(script, variables);
    assertPreScriptOutput(output);
    return output;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("SCRIPT_PRE_EXECUTION_FAILED", error instanceof Error ? error.message : "Pre script failed");
  }
}

/**
 * Runs post-response script and returns transformed response text.
 */
export function runPostScript(script: string, responseBody: string): string {
  if (!script.trim()) {
    return responseBody;
  }

  try {
    const output = executeScript<string, unknown>(script, responseBody);
    assertPostScriptOutput(output);
    return output;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("SCRIPT_POST_EXECUTION_FAILED", error instanceof Error ? error.message : "Post script failed");
  }
}
