/**
 * Executes user script with explicit inputs and returns output.
 */
export function executeScript<TInput, TOutput>(script: string, input: TInput): TOutput {
  const run = new Function(
    "input",
    `${script}\nconst __result = typeof transform === "function" ? transform(input) : undefined;\nreturn __result ?? input;`
  );
  return run(input) as TOutput;
}
