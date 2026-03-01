/**
 * Copies text to clipboard and returns whether operation succeeded.
 */
export async function copyTextToClipboard(
  text: string,
  writeText: (value: string) => Promise<void> = (value) => navigator.clipboard.writeText(value)
): Promise<boolean> {
  try {
    await writeText(text);
    return true;
  } catch {
    return false;
  }
}
