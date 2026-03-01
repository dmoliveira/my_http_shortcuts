import { afterEach, describe, expect, it, vi } from "vitest";
import { sendRuntimeMessage } from "../src/utils/io/runtime-message";

describe("sendRuntimeMessage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns result for successful response", async () => {
    vi.stubGlobal("chrome", {
      runtime: {
        sendMessage: vi.fn().mockResolvedValue({ ok: true, result: { value: 7 } })
      }
    });

    const result = await sendRuntimeMessage<{ value: number }>({ type: "shortcuts:list" });
    expect(result).toEqual({ value: 7 });
  });

  it("throws when response signals failure", async () => {
    vi.stubGlobal("chrome", {
      runtime: {
        sendMessage: vi.fn().mockResolvedValue({ ok: false, error: "failed" })
      }
    });

    await expect(sendRuntimeMessage({ type: "shortcuts:list" })).rejects.toThrowError(/failed/);
  });
});
