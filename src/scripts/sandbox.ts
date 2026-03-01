/**
 * Executes user script with explicit inputs and returns output.
 */
export function executeScript<TInput, TOutput>(script: string, input: TInput): TOutput {
  const run = new Function("input", `${script}\nreturn input;`);
  return run(input) as TOutput;
}
