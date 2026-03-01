import { describe, expect, it, vi } from "vitest";
import { runPopupAction } from "../src/popup/actions";

describe("runPopupAction", () => {
  it("returns true when action succeeds", async () => {
    const setStatus = vi.fn<(message: string) => void>();
    const result = await runPopupAction(async () => {}, setStatus, "Failed");
    expect(result).toBe(true);
    expect(setStatus).not.toHaveBeenCalled();
  });

  it("returns false and reports error when action fails", async () => {
    const setStatus = vi.fn<(message: string) => void>();
    const result = await runPopupAction(async () => {
      throw new Error("denied");
    }, setStatus, "Copy failed");

    expect(result).toBe(false);
    expect(setStatus).toHaveBeenCalledWith("Copy failed: denied");
  });
});
