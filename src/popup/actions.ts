/**
 * Executes popup action and reports failures via status callback.
 */
export async function runPopupAction(
  action: () => Promise<void>,
  setStatus: (message: string) => void,
  failureMessage: string
): Promise<boolean> {
  try {
    await action();
    return true;
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown popup error";
    setStatus(`${failureMessage}: ${detail}`);
    return false;
  }
}
