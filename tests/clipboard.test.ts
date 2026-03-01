import { describe, expect, it, vi } from "vitest";
import { copyTextToClipboard } from "../src/popup/clipboard";

describe("copyTextToClipboard", () => {
  it("returns true when write succeeds", async () => {
    const writeText = vi.fn<(_value: string) => Promise<void>>().mockResolvedValue();
    await expect(copyTextToClipboard("abc", writeText)).resolves.toBe(true);
  });

  it("returns false when write fails", async () => {
    const writeText = vi.fn<(_value: string) => Promise<void>>().mockRejectedValue(new Error("denied"));
    await expect(copyTextToClipboard("abc", writeText)).resolves.toBe(false);
  });
});
